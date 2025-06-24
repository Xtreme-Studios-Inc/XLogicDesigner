import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

@Component({
  selector: "x-io-pin",
  imports: [],
  templateUrl: "./io-pin.component.html",
  styleUrl: "./io-pin.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IoPinComponent {
  dragging = signal(false);
  startX = signal(0);
  startY = signal(0);
  mouseX = signal(0);
  mouseY = signal(0);

  // pointerDown(event: MouseEvent) {
  //   event.preventDefault();

  //   if (event.button == 0) this.drawLine(event);
  // }

  drawLine(event: MouseEvent, div: HTMLElement) {
    event.stopPropagation();

    window.addEventListener("mousemove", this.pointerMove);
    window.addEventListener("mouseup", this.pointerUp);

    const r = div.getBoundingClientRect();
    this.startX.set(r.left + r.width / 2);
    this.startY.set(r.top + r.height / 2);
    this.dragging.set(true);
  }

  // private dragOffsetX = 0;
  // private dragOffsetY = 0;
  // drawLine(event: MouseEvent) {
  //   this.mouseDownL.set(true);

  //   window.addEventListener("mousemove", this.pointerMove);
  //   window.addEventListener("mouseup", this.pointerUp);

  //   const zoom = this.gridZoom();

  //   this.dragOffsetX = event.clientX - this.x() * zoom; // or world-to-canvas mapping if zoomed/panned
  //   this.dragOffsetY = event.clientY - this.y() * zoom;
  // }

  pointerMove = (e: MouseEvent) => {
    this.mouseX.set(e.clientX);
    this.mouseY.set(e.clientY);

    console.log(
      "SVG line:",
      this.startX(),
      this.startY(),
      this.mouseX(),
      this.mouseY()
    );

    // console.log("x" + this.mouseX());
    // console.log("y" + this.mouseY());
  };
  pointerUp = () => {
    console.log(this.mouseX() + " : " + this.mouseY());
    this.dragging.set(false);
    window.removeEventListener("mousemove", this.pointerMove);
    window.removeEventListener("mouseup", this.pointerUp);
  };
}
