import { Component, OnInit } from '@angular/core';

interface Rune {
  name: string;
  level: number;
  count: number;
  image: string;
}

interface LogEntry {
  runNumber: number;
  runeName: string;
  timestamp: Date;
}

@Component({
  selector: 'app-lower-kurast-tracker',
  templateUrl: './lower-kurast-tracker.component.html',
  styleUrls: ['./lower-kurast-tracker.component.css']
})
export class LowerKurastTrackerComponent implements OnInit {
  runNumber: number = 1;
  runes: Rune[] = [];
  logEntries: LogEntry[] = [];

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
    this.addLogEntry(rune.name);
  }

  decrementRune(rune: Rune): void {
    if (rune.count > 0) {
      rune.count--;
    }
  }

  addLogEntry(runeName: string): void {
    this.logEntries.unshift({
      runNumber: this.runNumber,
      runeName: runeName,
      timestamp: new Date()
    });
  }

  onRunNumberChange(event: any): void {
    const newValue = parseInt(event.target.value);
    if (newValue >= 1) {
      this.runNumber = newValue;
    } else {
      event.target.value = this.runNumber;
    }
  }

  incrementRunNumber(): void {
    this.runNumber++;
  }
}
