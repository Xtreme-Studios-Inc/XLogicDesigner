import { Injectable, signal } from "@angular/core";

interface Pos {
  x: number;
  y: number;
}

@Injectable({
  providedIn: "root",
})
export class InputService {
  // Cursor Click Active
  cursorR = signal(false);
  cursorL = signal(false);

  dragging = signal(false);
  set cursorDrag(dragging: boolean) {
    this.dragging.set(dragging);
  }
  get cursorDrag() {
    return this.dragging();
  }

  lastCursorX = signal(0);
  lastCursorY = signal(0);

  constructor() {}

  // CURSOR POSITION
  setLastCursorPos(cursorX: number, cursorY: number) {
    this.lastCursorX.set(cursorX);
    this.lastCursorY.set(cursorY);
  }

  lastCursorPos(): Pos {
    return { x: this.lastCursorX(), y: this.lastCursorY() };
  }
}
