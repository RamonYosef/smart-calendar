import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [NgClass],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss'
})
export class ButtonsComponent {
  @Input() btnTitle: string = ""
  @Input() btnClass: 'primary' | 'secudary' = 'primary';
}
