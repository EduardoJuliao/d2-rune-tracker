import { Component, Input } from '@angular/core';
import { Rune, LogEntry } from '../../models/rune.model';

@Component({
  selector: 'app-run-log',
  templateUrl: './run-log.component.html',
  styleUrls: ['./run-log.component.css']
})
export class RunLogComponent {
  @Input() logEntries: LogEntry[] = [];
  @Input() runes: Rune[] = [];
  @Input() runCount: number = 0;
}
