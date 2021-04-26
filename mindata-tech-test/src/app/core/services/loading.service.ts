import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, pairwise, takeUntil } from 'rxjs/operators';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';

@Injectable({
  providedIn: 'root',
})
export class LoadingService implements OnDestroy {
  private overlayRef: OverlayRef = this.overlay.create({
    positionStrategy: this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically(),
  });
  private loadingPortal: ComponentPortal<LoadingComponent> = new ComponentPortal(
    LoadingComponent
  );
  private activeRequestsCount$: BehaviorSubject<number> = new BehaviorSubject(
    0
  );
  private _onDestroy: Subject<void> = new Subject();
  constructor(private overlay: Overlay) {
    const activeRequestsObservable = this.activeRequestsCount$.pipe(
      takeUntil(this._onDestroy),
      pairwise()
    );

    activeRequestsObservable
      .pipe(
        map(
          ([previousCount, currentCount]) =>
            currentCount > 0 && previousCount === 0
        ),
        filter((shouldAttach) => shouldAttach)
      )
      .subscribe(() => {
        this.overlayRef.attach(this.loadingPortal);
      });

    activeRequestsObservable
      .pipe(
        map(
          ([previousCount, currentCount]) =>
            currentCount === 0 && previousCount > 0
        ),
        filter((shouldDetach) => shouldDetach)
      )
      .subscribe(() => {
        this.overlayRef.detach();
      });
  }

  public requestStarted(): void {
    this.activeRequestsCount$.next(this.activeRequestsCount$.value + 1);
  }

  public requestEnded(): void {
    this.activeRequestsCount$.next(this.activeRequestsCount$.value - 1);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
  }
}
