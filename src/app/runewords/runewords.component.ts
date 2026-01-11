import { Component, OnInit, OnDestroy } from '@angular/core';
import runewordsD2R from '../../data/runewords-d2r.json';
import runewordsPD2 from '../../data/runewords-pd2.json';
import { LocalStorageService, GameVersion } from '../services/local-storage.service';

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
export class RunewordsComponent implements OnInit, OnDestroy {
  allRunewords: Runeword[] = [];
  filteredRunewords: Runeword[] = [];
  currentGameVersion: GameVersion = 'D2R';
  private gameVersionListener: ((event: Event) => void) | null = null;

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

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    // Load the current game version
    this.currentGameVersion = this.localStorageService.getGameVersion();
    this.loadRunewordsForVersion(this.currentGameVersion);

    // Listen for game version changes
    this.gameVersionListener = ((event: CustomEvent) => {
      const newVersion = event.detail.version as GameVersion;
      this.currentGameVersion = newVersion;
      this.loadRunewordsForVersion(newVersion);
    }) as EventListener;

    window.addEventListener('gameVersionChanged', this.gameVersionListener as EventListener);

    this.extractUniqueItemTypes();
    this.applyFilters();
  }

  ngOnDestroy(): void {
    if (this.gameVersionListener) {
      window.removeEventListener('gameVersionChanged', this.gameVersionListener as EventListener);
    }
  }

  loadRunewordsForVersion(version: GameVersion): void {
    // Clear existing filters when switching versions
    this.clearFilters();

    // Load the appropriate runewords data
    if (version === 'PD2') {
      this.allRunewords = runewordsPD2 as Runeword[];
    } else {
      this.allRunewords = runewordsD2R as Runeword[];
    }

    // Re-extract item types and apply filters
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
