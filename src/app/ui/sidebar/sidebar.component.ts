import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from "@angular/core";
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: "x-sidebar",
  imports: [ButtonComponent],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  collapsed = signal(false);
  toggle = output();

  collapse() {
    this.collapsed.update((value) => (value = !value));
    // this.collapsed.set(true);
  }
}
