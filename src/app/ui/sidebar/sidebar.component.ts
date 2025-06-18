import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'x-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent { }
