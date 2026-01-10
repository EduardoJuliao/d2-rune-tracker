import { Component, OnInit } from '@angular/core';
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
  selector: 'app-runewords',
  templateUrl: './runewords.component.html',
  styleUrls: ['./runewords.component.css']
})
export class RunewordsComponent implements OnInit {
  allRunewords: Runeword[] = runewordsData;
  filteredRunewords: Runeword[] = [];

  // Filter states
  searchText: string = '';
  selectedSockets: number | null = null;
  selectedRunes: Set<string> = new Set();
  selectedItemTypes: Set<string> = new Set();

  // Collapsible sections
  socketsCollapsed: boolean = false;
  runesCollapsed: boolean = false;
  itemTypesCollapsed: boolean = false;

  // Available options
  socketOptions: number[] = [2, 3, 4, 5, 6];
  availableRunes: string[] = [
    'El', 'Eld', 'Tir', 'Nef', 'Eth', 'Ith', 'Tal', 'Ral', 'Ort',
    'Amn', 'Shael', 'Thul', 'Sol', 'Dol', 'Hel', 'Io', 'Lum', 'Ko',
    'Fal', 'Lem', 'Pul', 'Um', 'Mal', 'Ist', 'Gul', 'Vex', 'Ohm',
    'Lo', 'Sur', 'Ber', 'Jah', 'Cham', 'Zod'
  ];
  availableItemTypes: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.extractUniqueItemTypes();
    this.applyFilters();
  }

  extractUniqueItemTypes(): void {
    const itemTypesSet = new Set<string>();
    this.allRunewords.forEach(rw => {
      rw.itemTypes.forEach(type => itemTypesSet.add(type));
    });
    this.availableItemTypes = Array.from(itemTypesSet).sort();
  }

  getRuneImage(runeName: string): string {
    return `assets/images/runes/${runeName.toLowerCase()}_rune.png`;
  }

  isRuneSelected(runeName: string): boolean {
    return this.selectedRunes.has(runeName);
  }

  onSocketFilterChange(sockets: number): void {
    if (this.selectedSockets === sockets) {
      this.selectedSockets = null;
    } else {
      this.selectedSockets = sockets;
    }
    this.applyFilters();
  }

  onRuneFilterChange(rune: string, checked: boolean): void {
    if (checked) {
      this.selectedRunes.add(rune);
    } else {
      this.selectedRunes.delete(rune);
    }
    this.applyFilters();
  }

  onItemTypeFilterChange(itemType: string, checked: boolean): void {
    if (checked) {
      this.selectedItemTypes.add(itemType);
    } else {
      this.selectedItemTypes.delete(itemType);
    }
    this.applyFilters();
  }

  onSearchChange(searchValue: string): void {
    this.searchText = searchValue;
    this.applyFilters();
  }

  toggleSockets(): void {
    this.socketsCollapsed = !this.socketsCollapsed;
  }

  toggleRunes(): void {
    this.runesCollapsed = !this.runesCollapsed;
  }

  toggleItemTypes(): void {
    this.itemTypesCollapsed = !this.itemTypesCollapsed;
  }

  applyFilters(): void {
    this.filteredRunewords = this.allRunewords.filter(rw => {
      // Text search filter - only search in runeword name
      if (this.searchText.trim() !== '') {
        const searchLower = this.searchText.toLowerCase();
        const nameLower = rw.name.toLowerCase();

        if (!nameLower.includes(searchLower)) {
          return false;
        }
      }

      // Socket filter
      if (this.selectedSockets !== null && rw.sockets !== this.selectedSockets) {
        return false;
      }

      // Rune filter - runeword must contain ALL selected runes
      if (this.selectedRunes.size > 0) {
        for (const selectedRune of this.selectedRunes) {
          if (!rw.runes.includes(selectedRune)) {
            return false;
          }
        }
      }

      // Item type filter - runeword must match at least one selected item type
      if (this.selectedItemTypes.size > 0) {
        const hasMatchingType = rw.itemTypes.some(type =>
          this.selectedItemTypes.has(type)
        );
        if (!hasMatchingType) {
          return false;
        }
      }

      return true;
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedSockets = null;
    this.selectedRunes.clear();
    this.selectedItemTypes.clear();
    this.applyFilters();
  }
}
