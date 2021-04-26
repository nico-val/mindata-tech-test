import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroesRoutingModule } from './heroes-routing.module';
import { HeroesComponent } from './pages/heroes/heroes.component';
import { HeroFormComponent } from './components/hero-form/hero-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FilterComponent } from './components/filter/filter.component';
import { DeleteHeroComponent } from './components/delete-hero/delete-hero.component';

@NgModule({
  declarations: [HeroesComponent, HeroFormComponent, FilterComponent, DeleteHeroComponent],
  imports: [CommonModule, HeroesRoutingModule, SharedModule],
})
export class HeroesModule {}
