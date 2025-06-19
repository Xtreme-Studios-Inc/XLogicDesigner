import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ToolbarComponent } from "../toolbar/toolbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: "x-ui-layer",
  imports: [ToolbarComponent, SidebarComponent],
  templateUrl: "./ui-layer.component.html",
  styleUrl: "./ui-layer.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLayerComponent {}
