import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutedDialogEntryComponent } from 'src/app/shared/modules/routed-dialog/components/routed-dialog-entry/routed-dialog-entry.component';
import { DeleteHeroComponent } from './components/delete-hero/delete-hero.component';
import { HeroFormComponent } from './components/hero-form/hero-form.component';
import { HeroesComponent } from './pages/heroes/heroes.component';

const routes: Routes = [
  {
    path: '',
    component: HeroesComponent,
    children: [
      {
        path: 'create',
        component: RoutedDialogEntryComponent,
        data: {
          dialogComponent: HeroFormComponent,
          dialogParameters: HeroFormComponent.dialogParams,
        },
      },
      {
        path: ':id/edit',
        component: RoutedDialogEntryComponent,
        data: {
          dialogComponent: HeroFormComponent,
          dialogParameters: HeroFormComponent.dialogParams,
        },
      },
      {
        path: ':id/delete',
        component: RoutedDialogEntryComponent,
        data: {
          dialogComponent: DeleteHeroComponent,
          // dialogParameters: HeroFormComponent.dialogParams,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeroesRoutingModule {}
