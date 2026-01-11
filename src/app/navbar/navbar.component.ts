import { Component, OnInit } from '@angular/core';
import { LocalStorageService, GameVersion } from '../services/local-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentGameVersion: GameVersion = 'D2R';

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.currentGameVersion = this.localStorageService.getGameVersion();
  }

  onGameVersionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newVersion = selectElement.value as GameVersion;
    this.currentGameVersion = newVersion;
    this.localStorageService.setGameVersion(newVersion);

    // Emit event to notify other components
    window.dispatchEvent(new CustomEvent('gameVersionChanged', {
      detail: { version: newVersion }
    }));
  }

  getD2RLogo(): string {
    return 'assets/images/logos/diablo-2-resurrected-logo.png';
  }

  getPD2Logo(): string {
    return 'assets/images/logos/PD2Logo.png';
  }
}
