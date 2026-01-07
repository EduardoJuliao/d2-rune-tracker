import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Rune } from '../../models/rune.model';

@Component({
  selector: 'app-rune-card',
  templateUrl: './rune-card.component.html',
  styleUrls: ['./rune-card.component.css']
})
export class RuneCardComponent {
  @Input() rune!: Rune;
  @Output() increment = new EventEmitter<Rune>();
  @Output() decrement = new EventEmitter<Rune>();

  onIncrement(): void {
    this.increment.emit(this.rune);
  }

  onDecrement(): void {
    this.decrement.emit(this.rune);
  }
}
