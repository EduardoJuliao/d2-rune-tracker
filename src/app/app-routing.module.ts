import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RuneTrackerComponent } from './rune-tracker/rune-tracker.component';
import { RunewordsComponent } from './runewords/runewords.component';

const routes: Routes = [
  { path: '', redirectTo: '/rune-tracker', pathMatch: 'full' },
  { path: 'rune-tracker', component: RuneTrackerComponent },
  { path: 'runewords', component: RunewordsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
