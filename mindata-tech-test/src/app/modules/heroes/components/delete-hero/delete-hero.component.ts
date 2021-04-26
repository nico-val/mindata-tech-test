import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-delete-hero',
  templateUrl: './delete-hero.component.html',
  styleUrls: ['./delete-hero.component.scss'],
})
export class DeleteHeroComponent {
  private get heroId(): string {
    return this.data && this.data.id ? this.data.id : null;
  }

  constructor(
    private heroesService: HeroesService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DeleteHeroComponent>
  ) {}

  public heroName$ = this.heroesService
    .getHeroById(this.heroId)
    .pipe(map((hero) => hero.name));
  public delete() {
    this.heroesService.deleteHero(this.heroId).subscribe({
      next: () => this.deleteSuccess(),
    });
  }

  private deleteSuccess() {
    console.log('this.snackbar', this.snackbar);
    this.snackbar.open('Hero successfully deleted', 'Ok');
    this.heroesService.refreshHeroes$.next();
    this.dialogRef.close();
  }
}
