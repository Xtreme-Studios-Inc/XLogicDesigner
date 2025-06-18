import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'x-pattern',
  imports: [],
  templateUrl: './pattern.component.html',
  styleUrl: './pattern.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatternComponent { }
