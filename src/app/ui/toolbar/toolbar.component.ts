import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'x-toolbar',
  imports: [],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent { }
