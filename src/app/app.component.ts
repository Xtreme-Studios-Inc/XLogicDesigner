import { Component, EventEmitter, input, output } from "@angular/core";

import { RouterOutlet } from "@angular/router";
import { invoke } from "@tauri-apps/api/core";
import { GridComponent } from "./core/grid/grid.component";
import { SidebarComponent } from "./ui/sidebar/sidebar.component";
import { ToolbarComponent } from "./ui/toolbar/toolbar.component";
import { UiLayerComponent } from "./ui/ui-layer/ui-layer.component";

@Component({
  selector: "x-root",
  imports: [
    RouterOutlet,
    GridComponent,
    SidebarComponent,
    ToolbarComponent,
    UiLayerComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  // sidebarCollapsed = false;

  greetingMessage = "";

  greet(event: SubmitEvent, name: string): void {
    event.preventDefault();

    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    invoke<string>("greet", { name }).then((text) => {
      this.greetingMessage = text;
    });
  }
}
