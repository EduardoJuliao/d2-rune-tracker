import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RuneTrackerComponent } from './rune-tracker/rune-tracker.component';
import { RuneCardComponent } from './rune-tracker/rune-card/rune-card.component';
import { ExportButtonComponent } from './rune-tracker/export-button/export-button.component';
import { RunLogComponent } from './rune-tracker/run-log/run-log.component';
import { LocalStorageService } from './services/local-storage.service';

@NgModule({
  declarations: [
    AppComponent,
    RuneTrackerComponent,
    RuneCardComponent,
    ExportButtonComponent,
    RunLogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [LocalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
