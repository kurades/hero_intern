import { Injectable } from '@angular/core';
import { Hero } from '../models/hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Tag } from '../models/tag';
@Injectable()
export class HeroService {
  private heroesUrl = 'api/heroes-manager';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor (
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  getHeroes (): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.heroesUrl}`).pipe(
      tap(() => {
        this.log('fetched heroes');
      }),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero (id: string): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(() => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero (hero: Hero): Observable<Hero> {
    const { tags, ...heroInfo } = hero;
    const tagIds = tags?.map(tag => tag._id);
    return this.http
      .put<Hero>(
        `${this.heroesUrl}/${hero._id}`,
        { ...heroInfo, tags: tagIds },
        this.httpOptions
      )
      .pipe(
        tap(() => this.log(`updated hero id=${hero._id}`)),
        catchError(this.handleError<Hero>('updateHero'))
      );
  }

  addHero (newHero: Hero): Observable<Hero> {
    const { tags, ...heroInfo } = newHero;
    const tagIds = tags?.map(tag => tag._id);
    return this.http
      .post<Hero>(
        `${this.heroesUrl}`,
        { ...heroInfo, tags: tagIds },
        this.httpOptions
      )
      .pipe(
        tap(() => this.log(`add hero w/ name=${newHero.name}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  deleteHero (id?: string): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(() => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes (term: string, tags: Tag[]): Observable<Hero[]> {
    let query = '';
    tags.forEach(tag => {
      query += `tagname[]=${tag._id}`;
    });
    query += `&name=${term}`;
    console.log(query);

    return this.http.get<Hero[]>(`${this.heroesUrl}?${query}`).pipe(
      tap(x =>
        x.length
          ? this.log(`found heroes matching ${term}`)
          : this.log(`not found hero matching ${term}`)
      ),
      catchError(this.handleError<Hero[]>('searchHero', []))
    );
  }

  getTags (): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.heroesUrl}/tag`).pipe(
      tap(() => this.log('get tags success')),
      catchError(this.handleError<Tag[]>('getTags', []))
    );
  }

  addTag (name: string): Observable<Tag> {
    return this.http
      .post<Tag>(`${this.heroesUrl}/tag`, { name }, this.httpOptions)
      .pipe(
        tap(() => this.log('add tags success')),
        catchError(this.handleError<Tag>('AddTags'))
      );
  }

  editTag (_id: string, name: string): Observable<Tag> {
    return this.http
      .put<Tag>(`${this.heroesUrl}/tag/${_id}`, { name }, this.httpOptions)
      .pipe(
        tap(() => this.log('edit tags success')),
        catchError(this.handleError<Tag>('editTags'))
      );
  }

  deleteTag (_id: string): Observable<Tag> {
    return this.http.delete<Tag>(`${this.heroesUrl}/tag/${_id}`).pipe(
      tap(() => this.log('delete tags success')),
      catchError(this.handleError<Tag>('deleteTags'))
    );
  }

  getTopHeroes (): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.heroesUrl}?limit=5`).pipe(
      tap(() => {
        this.log('fetched Top heroes');
      }),
      catchError(this.handleError<Hero[]>('getTopHeroes', []))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      this.log(`${operation} failed: ${error.error}`);
      return of(result as T);
    };
  }

  private log (message: string) {
    this.messageService.add(`HeroService:${message}`);
  }
}
