import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

@Component({
  selector: "x-io-pin",
  imports: [],
  templateUrl: "./io-pin.component.html",
  styleUrl: "./io-pin.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IoPinComponent {
  isDragging = false;
  startX = signal(0);
  startY = signal(0);
  mouseX = signal(0);
  mouseY = signal(0);

  drawLine(event: MouseEvent, div: HTMLElement) {
    event.stopPropagation();

    window.addEventListener("mousemove", this.move);
    window.addEventListener("mouseup", this.up);

    const r = div.getBoundingClientRect();
    this.startX.set(r.left + r.width / 2);
    this.startY.set(r.top + r.height / 2);
    this.isDragging = true;
  }

  move = (e: MouseEvent) => {
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
  up = () => {
    console.log(this.mouseX() + " : " + this.mouseY());
    this.isDragging = false;
    window.removeEventListener("mousemove", this.move);
    window.removeEventListener("mouseup", this.up);
  };
}
