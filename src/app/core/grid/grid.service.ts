import { Injectable, signal } from "@angular/core";
import { InputService } from "./input.service";
import { GridSettings } from "./grid.types";

@Injectable({
  providedIn: "root",
})
export class GridService {
  gridSettings: GridSettings = {
    color: "#272727",
    size: 10000,
    cellSize: 100,
    lineWidth: 3,
    baseZoom: 2,
    maxZoom: 2,
    minZoom: 0.4,
    zoomSpeed: 0.1,
  };
  get grid() {
    return this.gridSettings;
  }

  gridZoom = signal(this.grid.baseZoom);
  get zoom() {
    return this.gridZoom();
  }
  set zoom(zoom: number) {
    this.gridZoom.set(zoom);
  }

  offsetX = signal(-(this.grid.size / 2));
  offsetY = signal(-(this.grid.size / 2));

  constructor(private inputService: InputService) {}

  //#region GRID MOVE
  private calculateMaxMinOffset(): {
    minOffsetX: number;
    maxOffsetX: number;
    minOffsetY: number;
    maxOffsetY: number;
  } {
    const zoom = this.zoom; // your zoom signal

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

  moveGrid(deltaX: number, deltaY: number) {
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
  //#endregion

  //#region GRID ZOOM
  private zoomTarget = 1;
  private zoomAnimationFrame: number | null = null;

  smoothZoomStep = () => {
    const current = this.zoom;
    const target = this.zoomTarget;
    const ease = 0.16; // 0.16 = ease-in factor (lower = slower, more smooth)
    const next = current + (target - current) * ease;

    this.zoom = next;

    this.moveGrid(0, 0);

    // If close enough to the target, snap and stop
    if (Math.abs(target - next) < 0.001) {
      // this.zoom.set(target);
      this.zoom = target;
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

  changeZoom(wheelDeltaY: number) {
    let nextZoom =
      this.zoom -
      (wheelDeltaY > 0 ? this.grid.zoomSpeed : -this.grid.zoomSpeed);

    // Clamp the zoom
    nextZoom = Math.min(
      this.grid.maxZoom,
      Math.max(this.grid.minZoom, nextZoom)
    );

    this.easeZoomTo(nextZoom);
  }
  //#endregion
}
