import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  ViewChild,
} from "@angular/core";
import { ContextMenuComponent } from "../../ui/context-menu/context-menu.component";

@Component({
  selector: "x-grid",
  imports: [ContextMenuComponent],
  templateUrl: "./grid.component.html",
  styleUrl: "./grid.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
  // Grid Settings
  grid = {
    color: "#272727",
    size: 10000,
    cellSize: 100,
    lineWidth: 3,
    baseZoom: 2,
    maxZoom: 2,
    minZoom: 0.4,
  };

  @ViewChild("canvas", { static: true }) canvas!: ElementRef<HTMLDivElement>;

  showContextMenu = signal(false);

  offsetX = signal(-(this.grid.size / 2));
  offsetY = signal(-(this.grid.size / 2));

  mouseDownR = signal(false);
  mouseDownL = signal(false);

  dragging = signal(false);
  lastMouseX = signal(0);
  lastMouseY = signal(0);
  zoom = signal(this.grid.baseZoom);

  selectionActive = signal(false);
  selectionStartX = signal(0);
  selectionStartY = signal(0);
  selectionCurrentX = signal(0);
  selectionCurrentY = signal(0);

  get transform() {
    return `translate(${this.offsetX()}px, ${this.offsetY()}px) scale(${this.zoom()}`;
  }

  get gridBackground() {
    const line = `${this.grid.color}, ${this.grid.color} ${this.grid.lineWidth}px, transparent ${this.grid.lineWidth}px, transparent ${this.grid.cellSize}px`;
    return `repeating-linear-gradient(0deg, ${line}),
            repeating-linear-gradient(90deg, ${line})`;
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();

    if (this.dragging()) return;
    this.showContextMenu.set(true);
  }

  // Select
  leftClick(event: MouseEvent) {
    this.mouseDownL.set(true);

    this.selectionActive.set(true);
    this.selectionStartX.set(event.clientX);
    this.selectionStartY.set(event.clientY);
    this.selectionCurrentX.set(event.clientX);
    this.selectionCurrentY.set(event.clientY);

    window.addEventListener("mousemove", this.onGridMouseMove);
    window.addEventListener("mouseup", this.onGridMouseUp);
  }

  onGridMouseMove = (event: MouseEvent) => {
    if (!this.selectionActive()) return;
    console.log("grid mouse move");
    this.selectionCurrentX.set(event.clientX);
    this.selectionCurrentY.set(event.clientY);
  };

  onGridMouseUp = (event: MouseEvent) => {
    console.log("grid Mouse up");
    if (!this.selectionActive()) return;
    this.selectionActive.set(false);

    // Here, you can calculate selected items within the box

    window.removeEventListener("mousemove", this.onGridMouseMove);
    window.removeEventListener("mouseup", this.onGridMouseUp);
  };

  rightClick(event: MouseEvent) {
    this.mouseDownR.set(true);
    this.lastMouseX.set(event.clientX);
    this.lastMouseY.set(event.clientY);
  }

  //#region GRID MOVE
  private calculateMaxMinOffset(): {
    minOffsetX: number;
    maxOffsetX: number;
    minOffsetY: number;
    maxOffsetY: number;
  } {
    const zoom = this.zoom(); // your zoom signal

    const canvasWidth = this.grid.size * zoom;
    const canvasHeight = this.grid.size * zoom;

    // console.log(canvasWidth);

    const minOffsetX =
      -this.grid.size +
      window.innerWidth -
      7 +
      (this.grid.size - canvasWidth) / 2; // rightmost pan
    const maxOffsetX = (canvasWidth - this.grid.size) / 2; // leftmost pan

    const minOffsetY =
      -this.grid.size +
      window.innerHeight -
      7 +
      (this.grid.size - canvasHeight) / 2;
    const maxOffsetY = (canvasHeight - this.grid.size) / 2;

    return { minOffsetX, maxOffsetX, minOffsetY, maxOffsetY };
  }

  private moveGrid(deltaX: number, deltaY: number) {
    const { minOffsetX, maxOffsetX, minOffsetY, maxOffsetY } =
      this.calculateMaxMinOffset();

    // Prevents Panning too far Left
    const newOffsetX = this.offsetX() + deltaX;
    if (newOffsetX <= maxOffsetX && newOffsetX >= minOffsetX) {
      this.offsetX.set(newOffsetX);
    } else if (newOffsetX > maxOffsetX) {
      this.offsetX.set(maxOffsetX);
    } else if (newOffsetX < minOffsetX) {
      this.offsetX.set(minOffsetX);
    }

    // Prevents Panning too far Right
    const newOffsetY = this.offsetY() + deltaY;
    if (newOffsetY <= maxOffsetY && newOffsetY > minOffsetY) {
      this.offsetY.set(newOffsetY);
    } else if (newOffsetY > maxOffsetY) {
      this.offsetY.set(maxOffsetY);
    } else if (newOffsetY < minOffsetY) {
      this.offsetY.set(minOffsetY);
    }
  }

  pointerMove = (event: MouseEvent) => {
    if (!this.mouseDownR()) return;
    this.dragging.set(true);

    const deltaX = event.clientX - this.lastMouseX();
    const deltaY = event.clientY - this.lastMouseY();

    this.moveGrid(deltaX, deltaY);

    this.lastMouseX.set(event.clientX);
    this.lastMouseY.set(event.clientY);
  };
  //#endregion

  //#region GRID ZOOM
  private zoomTarget = 1;
  private zoomAnimationFrame: number | null = null;

  smoothZoomStep = () => {
    const current = this.zoom();
    const target = this.zoomTarget;
    const ease = 0.16; // 0.16 = ease-in factor (lower = slower, more smooth)
    const next = current + (target - current) * ease;

    this.zoom.set(next);
    this.moveGrid(0, 0);

    // If close enough to the target, snap and stop
    if (Math.abs(target - next) < 0.001) {
      this.zoom.set(target);
      this.zoomAnimationFrame = null;
      return;
    }

    this.zoomAnimationFrame = requestAnimationFrame(this.smoothZoomStep);
  };

  easeZoomTo(target: number) {
    this.zoomTarget = target;
    if (this.zoomAnimationFrame !== null) {
      cancelAnimationFrame(this.zoomAnimationFrame);
    }
    this.smoothZoomStep();
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();

    const ZOOM_STEP = 0.1;
    // const ZOOM_STEP = 0.05;
    let nextZoom = this.zoom() - (event.deltaY > 0 ? ZOOM_STEP : -ZOOM_STEP);

    // Clamp the zoom
    nextZoom = Math.min(
      this.grid.maxZoom,
      Math.max(this.grid.minZoom, nextZoom)
    );

    this.easeZoomTo(nextZoom);
  }
  //#endregion

  pointerDown(event: MouseEvent) {
    event.preventDefault();
    const button = event.button;
    this.showContextMenu.set(false);

    window.addEventListener("mousemove", this.pointerMove);
    window.addEventListener("mouseup", this.pointerUp);

    if (button == 0) this.leftClick(event);
    if (button == 2 || button == 1) this.rightClick(event);
  }

  pointerUp = () => {
    if (this.dragging()) {
      setTimeout(() => {
        this.dragging.set(false);
      }, 10);
    }
    this.mouseDownR.set(false);
    this.mouseDownL.set(false);

    window.removeEventListener("mousemove", this.pointerMove);
    window.removeEventListener("mouseup", this.pointerUp);
  };
}
