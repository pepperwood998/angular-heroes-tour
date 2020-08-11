import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
})
export class HeroSearchComponent implements OnInit {
  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after keystroke
      debounceTime(300),

      // ignore new term if its the same as previous
      distinctUntilChanged(),

      // switch to new search term when term changed
      // call the search service for terms that make it through the above 2 filters
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }

  private searchTerms = new Subject<string>();

  heroes$: Observable<Hero[]>;

  search(term: string): void {
    this.searchTerms.next(term);
  }
}
