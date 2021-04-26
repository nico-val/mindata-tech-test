import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
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

  public getHeroes() {
    return this.httpClient.get<Hero[]>(`${environment.apiUrl}/heroes`);
  }

  public getHeroById(id: string) {
    return this.httpClient.get<Hero>(`${environment.apiUrl}/heroes/${id}`);
  }

  public getHeroesByName(name: string) {
    return this.httpClient.get<Hero[]>(
      `${environment.apiUrl}/heroes?name=${name}`
    );
  }

  public createHero(hero: Hero) {
    return this.httpClient.post(`${environment.apiUrl}/heroes`, hero);
  }

  public updateHero(id: string, hero: Hero) {
    return this.httpClient.put(`${environment.apiUrl}/heroes/${id}`, hero);
  }

  public deleteHero(id: string) {
    return this.httpClient.delete(`${environment.apiUrl}/heroes/${id}`);
  }

  public getAllSuperpowers() {
    return this.httpClient.get<Superpower[]>(
      `${environment.apiUrl}/superpowers`
    );
  }
}
