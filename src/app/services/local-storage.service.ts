import { Injectable } from '@angular/core';
import { Rune, LogEntry } from '../models/rune.model';

interface TrackerState {
  runNumber: number;
  runes: Rune[];
  logEntries: LogEntry[];
}

interface SerializedLogEntry {
  runNumber: number;
  runeName: string;
  count: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly STORAGE_KEY_STATE = 'd2-rune-tracker.state';
  private readonly STORAGE_KEY_ENABLED = 'd2-rune-tracker.enabled';

  constructor() { }

  isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  saveTrackerState(runNumber: number, runes: Rune[], logEntries: LogEntry[]): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      const serializedLogEntries: SerializedLogEntry[] = logEntries.map(entry => ({
        runNumber: entry.runNumber,
        runeName: entry.runeName,
        count: entry.count,
        timestamp: entry.timestamp.toISOString()
      }));

      const state: TrackerState = {
        runNumber,
        runes,
        logEntries: serializedLogEntries as any
      };

      localStorage.setItem(this.STORAGE_KEY_STATE, JSON.stringify(state));
      return true;
    } catch (error) {
      console.warn('Failed to save tracker state to localStorage:', error);
      return false;
    }
  }

  loadTrackerState(): TrackerState | null {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_STATE);
      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored);

      if (!this.isValidState(parsed)) {
        console.warn('Invalid state structure in localStorage');
        this.clearTrackerState();
        return null;
      }

      const logEntries: LogEntry[] = parsed.logEntries.map((entry: SerializedLogEntry) => ({
        runNumber: entry.runNumber,
        runeName: entry.runeName,
        count: entry.count,
        timestamp: new Date(entry.timestamp)
      }));

      return {
        runNumber: parsed.runNumber,
        runes: parsed.runes,
        logEntries
      };
    } catch (error) {
      console.warn('Failed to load tracker state from localStorage:', error);
      return null;
    }
  }

  clearTrackerState(): void {
    if (!this.isLocalStorageAvailable()) {
      return;
    }

    try {
      localStorage.removeItem(this.STORAGE_KEY_STATE);
    } catch (error) {
      console.warn('Failed to clear tracker state from localStorage:', error);
    }
  }

  setStorageEnabled(enabled: boolean): void {
    if (!this.isLocalStorageAvailable()) {
      return;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY_ENABLED, JSON.stringify(enabled));
    } catch (error) {
      console.warn('Failed to save storage enabled preference:', error);
    }
  }

  getStorageEnabled(): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_ENABLED);
      if (!stored) {
        return false;
      }
      return JSON.parse(stored) === true;
    } catch (error) {
      console.warn('Failed to load storage enabled preference:', error);
      return false;
    }
  }

  private isValidState(state: any): boolean {
    return (
      state &&
      typeof state.runNumber === 'number' &&
      Array.isArray(state.runes) &&
      Array.isArray(state.logEntries) &&
      state.runes.every((rune: any) =>
        typeof rune.name === 'string' &&
        typeof rune.level === 'number' &&
        typeof rune.count === 'number' &&
        typeof rune.image === 'string'
      ) &&
      state.logEntries.every((entry: any) =>
        typeof entry.runNumber === 'number' &&
        typeof entry.runeName === 'string' &&
        typeof entry.count === 'number' &&
        typeof entry.timestamp === 'string'
      )
    );
  }
}
