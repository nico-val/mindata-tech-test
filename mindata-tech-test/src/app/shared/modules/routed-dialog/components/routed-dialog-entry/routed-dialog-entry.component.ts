import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, tap, takeUntil } from 'rxjs/operators';

@Component({
  template: '',
})
export class RoutedDialogEntryComponent implements OnDestroy {
  private dialogRef: MatDialogRef<unknown, any>;
  private onDestroy$: Subject<void> = new Subject();

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dialogRef = this.dialog.open(
      this.route.snapshot.data.dialogComponent,
      {
        ...this.route.snapshot.data.dialogParameters,
        data: {
          ...this.route.snapshot.data.dialogData,
          ...this.route.snapshot.params,
        },
      }
    );
    this.dialogRef.afterClosed().subscribe({
      next: () =>
        this.router.navigate(['.'], { relativeTo: this.route.parent }),
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .pipe(tap(() => this.dialogRef.close()))
      .pipe(takeUntil(this.onDestroy$))
      .subscribe();
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
  }
}
