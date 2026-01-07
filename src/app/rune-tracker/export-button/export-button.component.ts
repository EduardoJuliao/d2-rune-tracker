import { Component, Input } from '@angular/core';
import { Rune, LogEntry } from '../../models/rune.model';

@Component({
  selector: 'app-export-button',
  templateUrl: './export-button.component.html',
  styleUrls: ['./export-button.component.css']
})
export class ExportButtonComponent {
  @Input() logEntries: LogEntry[] = [];
  @Input() runes: Rune[] = [];
  @Input() buttonText: string = 'Export Log';
  @Input() filePrefix: string = 'rune-runs';
  @Input() runCount: number = 0;

  exportLog(): void {
    let exportText = 'Diablo II - Rune Run Log\n';
    exportText += '================================\n\n';

    if (this.logEntries.length === 0) {
      exportText += 'No runs logged yet.\n';
    } else {
      const sortedEntries = [...this.logEntries].reverse();
      sortedEntries.forEach(entry => {
        exportText += `Found ${entry.count} ${entry.runeName} rune${entry.count > 1 ? 's' : ''} in run ${entry.runNumber}\n`;
      });
    }

    exportText += '\n================================\n';
    exportText += `Total Runes Found in ${this.runCount} runs:\n`;
    this.runes.forEach(rune => {
      if (rune.count > 0) {
        exportText += `${rune.name}: ${rune.count}\n`;
      }
    });

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.filePrefix}-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
