import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { MovieList } from '../movies/movie-list/movie-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, MovieList],
  template: `
    <app-hero></app-hero>
    <app-movie-list></app-movie-list>
  `
})
export class HomeComponent {}
