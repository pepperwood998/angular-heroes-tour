import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  constructor(
    // contain information about the route to this class instance
    private route: ActivatedRoute,
    // for interacting with the browser
    private location: Location,
    private heroService: HeroService
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  hero: Hero;

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id).subscribe((hero) => (this.hero = hero));
  }

  save(): void {
    this.heroService
      .updateHero(this.hero)
      .subscribe(() => this.location.back());
  }

  goBack(): void {
    this.location.back();
  }
}
