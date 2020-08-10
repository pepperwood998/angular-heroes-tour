import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  constructor(
    private heroService: HeroService,
    private messageService: MessageService
  ) {}

  // life-cycle hook
  // initialization logic
  ngOnInit(): void {
    this.getHeroes();
  }

  heroes: Hero[];

  getHeroes(): void {
    // subscribe to asyc method and add callback
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }
}
