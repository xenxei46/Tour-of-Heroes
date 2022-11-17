import { Component, OnInit } from '@angular/core';

import { Observable, Subject  } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators'

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}
    // push a search term into the observable stream.
    search(term: string): void {
      this.searchTerms.next(term);
    }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms aftern each keystroke before onsidering the term debounceTime(300),
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new observable each time th term changes
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }

}
