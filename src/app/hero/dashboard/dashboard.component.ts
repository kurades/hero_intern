import { Component, OnInit } from '@angular/core';
import { Hero } from '../../core/models/hero';
import { Store } from '@ngrx/store';
import { selectHeros } from '../../core/store/Hero/hero.selector';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/core/store/app.state';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  storeHeroes$ = this.store.select(selectHeros);
  heroes: Hero[];
  private subcription: Subscription;
  constructor (private store: Store<AppState>) {}

  ngOnInit (): void {
    this.getTopHeroes();
  }

  ngOnDestroy (): void {
    this.subcription.unsubscribe();
  }
  
  private getTopHeroes (): void {
    this.subcription = this.storeHeroes$.subscribe(heroes => {
      this.heroes = heroes.slice(0, 5);
    });
  }
}
