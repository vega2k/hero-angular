import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {tap, catchError} from 'rxjs/operators';

import {MessageService} from './message.service';
import {Hero} from './hero';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'http://localhost:8087/heroes';

  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
  private handleError<T> (operation = 'operation', result?: T) {
    return(error: any): Observable<T> => {
// TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
// TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
// Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log(`fetched ${heroes.length}`)),
        catchError(this.handleError('getHeroes', []))
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>('getHero'))
      );
  }

  updateHero(hero: Hero): Observable<Hero> {
    const url = `${this.heroesUrl}/${hero.id}`;
    return this.http.put(url, hero, httpOptions)
      .pipe(
        tap((h: Hero) => this.log(`updated hero id=${h.id}`)),
        catchError(this.handleError<Hero>('updateHero'))
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap((h: Hero) => this.log(`added hero id=${h.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  deleteHero(hero: Hero): Observable<Boolean> {
    const id = hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete(url)
      .pipe(
        tap((result: Boolean) =>
          this.log(`deleted hero id=${id} ${result}`)),
        catchError(this.handleError<Boolean>('deleteHero'))
      );
  }

  searchHero(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    const url = `${this.heroesUrl}/?name=${term}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        tap(_ => this.log(`found heroes matching "${term}"`)),
        catchError(this.handleError('searchHero', []))
      );
  }

}
