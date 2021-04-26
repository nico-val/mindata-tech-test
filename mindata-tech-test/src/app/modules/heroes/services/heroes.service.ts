import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Hero } from '../models/hero';
import { Superpower } from '../../superpowers/models/superpower';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  public refreshHeroes$: Subject<void> = new Subject();
  constructor(private httpClient: HttpClient) {}

  public getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(`${environment.apiUrl}/heroes`);
  }

  public getHeroById(id: string): Observable<Hero> {
    return this.httpClient.get<Hero>(`${environment.apiUrl}/heroes/${id}`);
  }

  public getHeroesByName(name: string): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(
      `${environment.apiUrl}/heroes?name=${name}`
    );
  }

  public createHero(hero: Hero): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/heroes`, hero);
  }

  public updateHero(id: string, hero: Hero): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}/heroes/${id}`, hero);
  }

  public deleteHero(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}/heroes/${id}`);
  }

  public getAllSuperpowers(): Observable<Superpower[]> {
    return this.httpClient.get<Superpower[]>(
      `${environment.apiUrl}/superpowers`
    );
  }
}
