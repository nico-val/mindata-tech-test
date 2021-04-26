import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, shareReplay, startWith, takeUntil } from 'rxjs/operators';
import { Superpower } from 'src/app/modules/superpowers/models/superpower';
import { NoWhitespaceValidator } from 'src/app/shared/validators/whitespace.validator';
import { Hero } from '../../models/hero';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-hero-form',
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.scss'],
})
export class HeroFormComponent implements OnInit, AfterViewInit, OnDestroy {
  public static dialogParams: MatDialogConfig = {
    width: '600px',
    closeOnNavigation: true,
    disableClose: true,
  };

  public superpowers$: Observable<
    Superpower[]
  > = this.heroService.getAllSuperpowers().pipe(shareReplay(1));
  filteredSuperpowers$: Observable<Superpower[]>;
  superpowerFilter$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  @ViewChild('filterInput') filterInput: ElementRef;
  readonly separatorKeysCodes: number[] = [];

  public form = this.formBuilder.group({
    name: [null, [Validators.required, NoWhitespaceValidator]],
    birthday: [null, Validators.required],
    superpowers: [[], Validators.required],
  });

  private onDestroy$: Subject<void> = new Subject();
  public saving$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get heroId(): string {
    return this.data && this.data.id ? this.data.id : null;
  }

  public hero$ = this.heroService
    .getHeroById(this.heroId)
    .pipe(takeUntil(this.onDestroy$), shareReplay());

  public get creation(): boolean {
    return !(this.data && this.data.id);
  }

  public get edition(): boolean {
    return this.data && this.data.id;
  }

  constructor(
    private heroService: HeroesService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<HeroFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.edition) {
      this.hero$.subscribe({
        next: (res) => {
          console.log('res.birthday', res.birthday);
          this.form.controls.name.setValue(res.name);
          this.form.controls.birthday.setValue(res.birthday);
          this.form.controls.superpowers.setValue(res.superpowers);
        },
      });
    }
  }

  ngAfterViewInit(): void {
    this.filteredSuperpowers$ = combineLatest([
      this.superpowers$,
      this.superpowerFilter$,
      this.form.controls.superpowers.valueChanges.pipe(
        startWith(null)
      ),
    ]).pipe(
      takeUntil(this.onDestroy$),
      map(
        ([superpowers, filter, superpowersFormArrayValues]: [
          Superpower[],
          string,
          Superpower[]
        ]) => {
          const filteredSuperpowers = filter
            ? superpowers.filter(
                (superpower) =>
                  superpower.name
                    .toLowerCase()
                    .indexOf(filter?.toLowerCase()) === 0
              )
            : superpowers;
          const unusedFilteredSuperpowers = superpowersFormArrayValues
            ? filteredSuperpowers.filter(
                (l) =>
                  superpowersFormArrayValues.findIndex((v) => v.id === l.id) ===
                  -1
              )
            : filteredSuperpowers;
          return unusedFilteredSuperpowers;
        }
      )
    );
  }

  removeSuperpower(superpower: any): void {
    const removeIndex = this.form.controls.superpowers.value.indexOf(
      superpower
    );
    if (removeIndex >= 0) {
      this.form.controls.superpowers.setValue(
        this.form.controls.superpowers.value.filter(
          (_value: any, index: number) => index !== removeIndex
        )
      );
      this.form.controls.superpowers.markAsDirty();
    }
  }

  selectSuperpower(event: MatAutocompleteSelectedEvent): void {
    console.log('event', event);
    this.form.controls.superpowers.setValue([
      ...this.form.controls.superpowers.value,
      event.option.value,
    ]);
    this.form.controls.superpowers.markAsDirty();
    this.filterInput.nativeElement.value = null;
    this.superpowerFilter$.next('');
  }

  save() {
    if (this.saving$.value) {
      return;
    }
    this.saving$.next(true);

    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    const hero = new Hero(this.form.value);

    if (this.creation) {
      this.heroService
        .createHero(hero)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => this.saveSuccess(), console.error);
    } else if (this.edition) {
      this.heroService
        .updateHero(this.heroId, hero)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => this.saveSuccess(), console.error);
    }
  }

  private saveSuccess() {
    this.saving$.next(false);
    this.heroService.refreshHeroes$.next();
    this.dialogRef.close();
    this.snackBar.open(
      this.creation ? 'Hero successfully saved' : this.edition ? 'Hero successfully edited' : '',
      'Ok'
    );
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }
}
