import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  ViewChild,
} from "@angular/core";
import { ContextMenuComponent } from "../../ui/context-menu/context-menu.component";
import { PatternComponent } from "../pattern/pattern.component";
import { SaveFile } from "../types/project-types";
import {
  PatternDefinition,
  PatternType,
} from "../pattern/pattern-type/pattern";
import { PatternService } from "../pattern/pattern-type/pattern.service";
import { GridService } from "./grid.service";
import { InputService } from "./input.service";
import { GridSettings } from "./grid.types";

@Component({
  selector: "x-grid",
  imports: [ContextMenuComponent, PatternComponent],
  templateUrl: "./grid.component.html",
  styleUrl: "./grid.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
  // Grid Settings
  grid: GridSettings;

  constructor(
    private inputService: InputService,
    public gridService: GridService,
    private patternService: PatternService
  ) {
    this.grid = this.gridService.grid;
  }

  @ViewChild("canvas", { static: true }) canvas!: ElementRef<HTMLDivElement>;

  showContextMenu = signal(false);

  // offsetX = signal(-(this.gridService.grid.size / 2));
  // offsetY = signal(-(this.gridService.grid.size / 2));

  // selectionActive = signal(false);
  // selectionStartX = signal(0);
  // selectionStartY = signal(0);
  // selectionCurrentX = signal(0);
  // selectionCurrentY = signal(0);

  get cursorPos() {
    return this.inputService.lastCursorPos();
  }
  set cursorPos(cursorPos: { x: number; y: number }) {
    this.inputService.setLastCursorPos(cursorPos.x, cursorPos.y);
  }

  get cursorDrag() {
    return this.inputService.cursorDrag;
  }
  set cursorDrag(dragging: boolean) {
    this.inputService.cursorDrag = dragging;
  }

  get transform() {
    return `translate(${this.gridService.offsetX()}px, ${this.gridService.offsetY()}px) scale(${
      this.gridService.zoom
    }`;
  }

  get gridBackground() {
    const line = `${this.grid.color}, ${this.grid.color} ${this.grid.lineWidth}px, transparent ${this.grid.lineWidth}px, transparent ${this.grid.cellSize}px`;
    return `repeating-linear-gradient(0deg, ${line}),
            repeating-linear-gradient(90deg, ${line})`;
  }

  //#region SAVE
  saveFile: SaveFile = {
    pieces: [PatternType.AND, PatternType.OR, PatternType.NOT],
  };

  get project() {
    const project: PatternDefinition[] = this.saveFile.pieces.map((element) => {
      return this.patternService.createPattern(element);
    });
    return project;
  }
  //#endregion

  onContextMenu(event: MouseEvent) {
    event.preventDefault();

    if (this.cursorDrag) return;
    this.showContextMenu.set(true);
  }

  // Select
  leftClick(event: MouseEvent) {
    this.inputService.cursorL.set(true);

    // this.selectionActive.set(true);
    // this.selectionStartX.set(event.clientX);
    // this.selectionStartY.set(event.clientY);
    // this.selectionCurrentX.set(event.clientX);
    // this.selectionCurrentY.set(event.clientY);

    // window.addEventListener("mousemove", this.onGridMouseMove);
    // window.addEventListener("mouseup", this.onGridMouseUp);
  }

  // onGridMouseMove = (event: MouseEvent) => {
  //   if (!this.selectionActive()) return;
  //   // console.log("grid mouse move");
  //   this.selectionCurrentX.set(event.clientX);
  //   this.selectionCurrentY.set(event.clientY);
  // };

  // onGridMouseUp = (event: MouseEvent) => {
  //   // console.log("grid Mouse up");
  //   if (!this.selectionActive()) return;
  //   this.selectionActive.set(false);

  //   // Here, you can calculate selected items within the box

  //   window.removeEventListener("mousemove", this.onGridMouseMove);
  //   window.removeEventListener("mouseup", this.onGridMouseUp);
  // };

  rightClick(event: MouseEvent) {
    this.inputService.cursorR.set(true);
    this.cursorPos = { x: event.clientX, y: event.clientY };
  }

  //#region GRID MOVE
  pointerMove = (event: MouseEvent) => {
    if (!this.inputService.cursorR()) return;
    this.cursorDrag = true;

    const { x: cursorX, y: cursorY } = this.cursorPos;
    const deltaX = event.clientX - cursorX;
    const deltaY = event.clientY - cursorY;

    this.gridService.moveGrid(deltaX, deltaY);

    this.cursorPos = { x: event.clientX, y: event.clientY };
  };
  //#endregion

  //#region GRID ZOOM
  onWheel(event: WheelEvent) {
    event.preventDefault();

    this.gridService.changeZoom(event.deltaY);
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
    if (this.cursorDrag) {
      setTimeout(() => {
        this.cursorDrag = false;
      }, 10);
    }
    this.inputService.cursorR.set(false);
    this.inputService.cursorL.set(false);

    window.removeEventListener("mousemove", this.pointerMove);
    window.removeEventListener("mouseup", this.pointerUp);
  };
}
