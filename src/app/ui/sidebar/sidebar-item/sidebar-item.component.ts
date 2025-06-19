import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'x-sidebar-item',
  imports: [],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarItemComponent { }
