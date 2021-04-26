import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, from, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Hero } from '../../models/hero';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
})
export class HeroesComponent implements OnInit, AfterViewInit, OnDestroy {
  public displayedColumns: string[] = ['name', 'birthday', 'superpowers', 'actions'];
  private heroes$ = this.heroesService
    .getHeroes()
    .pipe(tap((heroes) => (this.dataSource.data = heroes)));

  public dataSource: MatTableDataSource<Hero> = new MatTableDataSource<Hero>();
  @ViewChild(MatPaginator, { static: false }) private paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) private sort: MatSort;

  public filterText$ = new Subject<string>();
  private onDestroy$: Subject<void> = new Subject();
  constructor(
    private heroesService: HeroesService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.heroesService.refreshHeroes$
      .pipe(
        startWith(null as unknown),
        takeUntil(this.onDestroy$),
        switchMap(() => this.heroes$)
      )
      .subscribe();
  }

  ngAfterViewInit(): void {

    const getKeyValue = <T extends object, U extends keyof T>(obj: T) => (key: U) => obj[key];


    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (data, attribute) =>
      (getKeyValue(data)(attribute as keyof Hero) as string).toLowerCase();
    this.filterText$.subscribe({
      next: (filterText) => (this.dataSource.filter = filterText),
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}
