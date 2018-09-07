import { Component, OnInit } from '@angular/core';

import {Hero} from '../hero';
import {HeroService} from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  // hero: Hero = {id: 1, name: 'winstorm'};
  selectedHero: Hero;
  heroes: Hero[];

  constructor(private heroService: HeroService) {
    console.log('HeroesComponent constructor');
  }

  ngOnInit() {
    console.log('HeroesComponent ngOnInit');
    this.getHeroes();
  }

  // onSelect(hero: Hero): void {
  //   this.selectedHero = hero;
  // }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroesArr => this.heroes = heroesArr);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }

    this.heroService.addHero({name} as Hero)
      .subscribe(hero => this.heroes.push(hero));
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }

}
