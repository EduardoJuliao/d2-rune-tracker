import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Rune, LogEntry } from '../models/rune.model';
import { LocalStorageService } from '../services/local-storage.service';
import runewordsData from '../../data/runewords-d2r.json';

interface Runeword {
  name: string;
  runes: string[];
  itemTypes: string[];
  sockets: number;
  level: number;
  properties: string[];
}

@Component({
  selector: 'app-rune-tracker',
  templateUrl: './rune-tracker.component.html',
  styleUrls: ['./rune-tracker.component.css'],
  animations: [
    trigger('slideDown', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden',
        opacity: '0'
      })),
      state('expanded', style({
        height: '*',
        overflow: 'visible',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class RuneTrackerComponent implements OnInit {
  runNumber: number = 1;
  runes: Rune[] = [];
  logEntries: LogEntry[] = [];
  currentRunRunes: Map<string, number> = new Map();
  storageEnabled: boolean = false;

  runeRows: Rune[][] = [];
  allRunewords: Runeword[] = runewordsData;

  // Collapsible section states
  craftableRunewordsExpanded: boolean = true;
  runLogExpanded: boolean = false;

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.initializeRunes();

    this.storageEnabled = this.localStorageService.getStorageEnabled();

    if (this.storageEnabled) {
      const savedState = this.localStorageService.loadTrackerState();
      if (savedState) {
        this.runNumber = savedState.runNumber;
        this.runes = savedState.runes;
        this.logEntries = savedState.logEntries;
      }
    }

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
    this.saveToLocalStorage();
  }

  onRunNumberChange(event: any): void {
    const newValue = parseInt(event.target.value);
    if (newValue >= 1 && newValue !== this.runNumber) {
      this.finalizeCurrentRun();
      this.runNumber = newValue;
      this.saveToLocalStorage();
    } else if (newValue < 1) {
      event.target.value = this.runNumber;
    }
  }

  incrementRunNumber(): void {
    this.finalizeCurrentRun();
    this.runNumber++;
    this.saveToLocalStorage();
  }

  onStorageToggle(enabled: boolean): void {
    this.storageEnabled = enabled;
    this.localStorageService.setStorageEnabled(enabled);

    if (enabled) {
      this.saveToLocalStorage();
    } else {
      this.localStorageService.clearTrackerState();
    }
  }

  private saveToLocalStorage(): void {
    if (this.storageEnabled) {
      this.localStorageService.saveTrackerState(
        this.runNumber,
        this.runes,
        this.logEntries
      );
    }
  }

  get craftableRunewords(): Runeword[] {
    return this.allRunewords.filter(runeword => {
      // Check if we have all required runes for this runeword
      return runeword.runes.every(requiredRune => {
        const rune = this.runes.find(r => r.name === requiredRune);
        return rune && rune.count > 0;
      });
    });
  }

  getRuneImage(runeName: string): string {
    return `assets/images/runes/${runeName.toLowerCase()}_rune.png`;
  }

  isRuneInInventory(runeName: string): boolean {
    const rune = this.runes.find(r => r.name === runeName);
    return rune ? rune.count > 0 : false;
  }

  toggleCraftableRunewords(): void {
    this.craftableRunewordsExpanded = !this.craftableRunewordsExpanded;
  }

  toggleRunLog(): void {
    this.runLogExpanded = !this.runLogExpanded;
  }
}
