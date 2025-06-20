import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "x-icon",
  imports: [],
  templateUrl: "./icon.component.html",
  styleUrl: "./icon.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  iconName = input.required<string>();

  get iconUrl(): string {
    const iconName = this.iconName();
    return `assets/icons/${iconName}.svg`;
  }
}
