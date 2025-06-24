import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";

@Component({
  selector: "x-context-menu",
  imports: [],
  templateUrl: "./context-menu.component.html",
  styleUrl: "./context-menu.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuComponent {
  isVisable = input.required<boolean>();
  // menuX = signal(0);
  // menuY = signal(0);

  menuPos = input.required<{ x: number; y: number }>();

  // menuX = input.required<number>();
  // menuY = input.required<number>();

  // Optional: track which item was right-clicked, e.g., a puzzle piece
  rightClickedPieceId: string | null = null;

  doAction(action: string) {
    console.log(action);
  }
}
