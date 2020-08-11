import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private heroesUrl = 'api/heroes'; // URL to web api
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      // tap into the flow of this observale
      // send message after getting the data
      tap((_) => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const uri = `${this.heroesUrl}/${id}`;
    return this.http
      .get<Hero>(uri)
      .pipe(
        tap(
          (_) => this.log(`fetched hero id=${id}`),
          catchError(this.handleError<Hero>(`getHero id=${id}`))
        )
      );
  }

  addHero(hero: Hero): Observable<any> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  deleteHero(hero: Hero | number): Observable<any> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const uri = `${this.heroesUrl}/${id}`;

    return this.http.delete(uri, this.httpOptions).pipe(
      tap((_) => this.log(`delete hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }

    const uri = `${this.heroesUrl}?name=${term}`;
    return this.http.get<Hero[]>(uri).pipe(
      tap((hs) =>
        hs.length
          ? this.log(`found hero matching "${term}"`)
          : this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // may do some remote logging
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      // keep the app running with empty result
      return of(result as T);
    };
  }
}
