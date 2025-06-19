import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";

@Component({
  selector: "x-pattern",
  imports: [],
  templateUrl: "./pattern.component.html",
  styleUrl: "./pattern.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatternComponent {
  canvasRect = input.required<DOMRect>();

  x = signal(5000);
  y = signal(5000);

  gridZoom = input.required<number>();
  gridSize = input.required<number>();

  mouseDownR = signal(false);
  mouseDownL = signal(false);

  dragging = signal(false);
  lastMouseX = signal(0);
  lastMouseY = signal(0);

  // Select
  leftClick(event: MouseEvent) {
    this.mouseDownL.set(true);

    window.addEventListener("mousemove", this.pointerMove);
    window.addEventListener("mouseup", this.pointerUp);
  }

  private movePattern(deltaX: number, deltaY: number) {
    console.log(this.gridZoom());
    // const cX =
    // console.log("dx: " + deltaX * this.gridZoom());
    // console.log("dy: " + deltaY * this.gridZoom());
    // this.x.set(event.clientX);
    this.x.set(deltaX + this.gridZoom() / 700);
    // this.y.set(event.clientY);
    this.y.set(deltaY + this.gridZoom() / 700);
  }

  pointerMove = (event: MouseEvent) => {
    if (!this.mouseDownL()) return;
    this.dragging.set(true);

    // const deltaX = event.clientX - this.lastMouseX();
    // const deltaY = event.clientY - this.lastMouseY();

    // To convert screen (mouse) coordinates to grid coordinates:
    // const rect = this.canvas.nativeElement.getBoundingClientRect();
    // const mouseCanvasX =
    //   (event.clientX - this.canvasRect().left) / this.gridZoom();
    // const mouseCanvasY =
    //   (event.clientY - this.canvasRect().top) / this.gridZoom();

    const newX = event.clientX - this.dragOffsetX;
    const newY = event.clientY - this.dragOffsetY;

    this.movePattern(newX, newY);
    // this.movePattern(deltaX, deltaY);
    // this.x.set(mouseCanvasX - this.dragOffsetX);
    // this.y.set(mouseCanvasY - this.dragOffsetY);

    // console.log("x", event.clientX);
    // console.log("y", event.clientY);

    // this.x.set(newX);
    // this.y.set(newY);

    this.lastMouseX.set(event.clientX);
    this.lastMouseY.set(event.clientY);
  };

  private dragOffsetX = 0;
  private dragOffsetY = 0;
  pointerDown(event: MouseEvent) {
    event.preventDefault();
    const button = event.button;

    console.log("Before: ");
    console.log(this.x());
    console.log(this.y());

    this.dragOffsetX = event.clientX - this.x(); // or world-to-canvas mapping if zoomed/panned
    this.dragOffsetY = event.clientY - this.y();

    if (button == 0) this.leftClick(event);
    // if (button == 2 || button == 1) this.rightClick(event);
  }

  pointerUp = () => {
    if (this.dragging()) {
      setTimeout(() => {
        this.dragging.set(false);
      }, 10);
    }
    this.mouseDownR.set(false);
    this.mouseDownL.set(false);

    console.log("After: ");
    console.log(this.x());
    console.log(this.y());

    window.removeEventListener("mousemove", this.pointerMove);
    window.removeEventListener("mouseup", this.pointerUp);
  };
}
