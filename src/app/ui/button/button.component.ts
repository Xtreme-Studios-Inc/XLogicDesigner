import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { IconComponent } from "../icon/icon.component";

@Component({
  selector: "xbutton",
  imports: [IconComponent],
  templateUrl: "./button.component.html",
  styleUrl: "./button.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  icon = input<string>("");
  label = input<string>();

  clicked = output();

  buttonClicked() {
    this.clicked.emit();
  }
}
