import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from "@angular/core";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "x-sidebar",
  imports: [IconComponent],
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
