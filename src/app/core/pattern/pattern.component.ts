import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";
import { PatternTypeComponent } from "./pattern-type/pattern-type.component";

@Component({
  selector: "x-pattern",
  imports: [PatternTypeComponent],
  templateUrl: "./pattern.component.html",
  styleUrl: "./pattern.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatternComponent {
  x = signal(5000);
  y = signal(5000);

  gridZoom = input.required<number>();
  gridSize = input.required<number>();

  mouseDownR = signal(false);
  mouseDownL = signal(false);

  dragging = signal(false);

  pattern = input.required<string>();

  pointerDown(event: MouseEvent) {
    event.preventDefault();

    if (event.button == 0) this.select(event);
  }

  // Select
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  select(event: MouseEvent) {
    this.mouseDownL.set(true);

    window.addEventListener("mousemove", this.pointerMove);
    window.addEventListener("mouseup", this.pointerUp);

    const zoom = this.gridZoom();

    this.dragOffsetX = event.clientX - this.x() * zoom; // or world-to-canvas mapping if zoomed/panned
    this.dragOffsetY = event.clientY - this.y() * zoom;
  }

  pointerMove = (event: MouseEvent) => {
    if (!this.mouseDownL()) return;
    this.dragging.set(true);

    const zoom = this.gridZoom();

    const newGridX = (event.clientX - this.dragOffsetX) / zoom;
    const newGridY = (event.clientY - this.dragOffsetY) / zoom;

    this.x.set(newGridX);
    this.y.set(newGridY);
  };

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
