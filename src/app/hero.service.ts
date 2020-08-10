import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private heroesUrl = 'api/heroes'; // URL to web api

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      // tap into the flow of this observale
      // send message after getting the data
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const uri = `${this.heroesUrl}/${id}`;
    return this.http
      .get<Hero>(uri)
      .pipe(
        tap(
          _ => this.log(`fetched hero id=${id}`),
          catchError(this.handleError<Hero>(`getHero id=${id}`))
        )
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
