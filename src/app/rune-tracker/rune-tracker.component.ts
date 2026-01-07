import { Component, OnInit } from '@angular/core';
import { Rune, LogEntry } from '../models/rune.model';

@Component({
  selector: 'app-rune-tracker',
  templateUrl: './rune-tracker.component.html',
  styleUrls: ['./rune-tracker.component.css']
})
export class RuneTrackerComponent implements OnInit {
  runNumber: number = 1;
  runes: Rune[] = [];
  logEntries: LogEntry[] = [];
  currentRunRunes: Map<string, number> = new Map();

  runeRows: Rune[][] = [];

  constructor() { }

  ngOnInit(): void {
    this.initializeRunes();
    this.organizeRunesIntoRows();
  }

  initializeRunes(): void {
    const runeNames = [
      'El', 'Eld', 'Tir', 'Nef', 'Eth', 'Ith', 'Tal', 'Ral', 'Ort',
      'Amn', 'Shael', 'Thul', 'Sol', 'Dol', 'Hel', 'Io', 'Lum', 'Ko',
      'Fal', 'Lem', 'Pul', 'Um', 'Mal', 'Ist', 'Gul', 'Vex', 'Ohm',
      'Lo', 'Sur', 'Ber', 'Jah', 'Cham', 'Zod'
    ];

    this.runes = runeNames.map((name, index) => ({
      name: name,
      level: index + 1,
      count: 0,
      image: `assets/images/runes/${name.toLowerCase()}_rune.png`
    }));
  }

  organizeRunesIntoRows(): void {
    this.runeRows = [
      this.runes.slice(0, 9),   // El to Ort
      this.runes.slice(9, 18),  // Amn to Ko
      this.runes.slice(18, 27), // Fal to Ohm
      this.runes.slice(27, 33)  // Lo to Zod
    ];
  }

  incrementRune(rune: Rune): void {
    rune.count++;
    const currentCount = this.currentRunRunes.get(rune.name) || 0;
    this.currentRunRunes.set(rune.name, currentCount + 1);
  }

  decrementRune(rune: Rune): void {
    if (rune.count > 0) {
      rune.count--;
      const currentCount = this.currentRunRunes.get(rune.name) || 0;
      if (currentCount > 0) {
        this.currentRunRunes.set(rune.name, currentCount - 1);
      }
    }
  }

  finalizeCurrentRun(): void {
    const currentRun = this.runNumber;
    this.currentRunRunes.forEach((count, runeName) => {
      if (count > 0) {
        this.logEntries.unshift({
          runNumber: currentRun,
          runeName: runeName,
          count: count,
          timestamp: new Date()
        });
      }
    });
    this.currentRunRunes.clear();
  }

  onRunNumberChange(event: any): void {
    const newValue = parseInt(event.target.value);
    if (newValue >= 1 && newValue !== this.runNumber) {
      this.finalizeCurrentRun();
      this.runNumber = newValue;
    } else if (newValue < 1) {
      event.target.value = this.runNumber;
    }
  }

  incrementRunNumber(): void {
    this.finalizeCurrentRun();
    this.runNumber++;
  }
}
