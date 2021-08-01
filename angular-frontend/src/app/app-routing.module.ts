import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnimeInfoComponent } from './component/anime-info/anime-info.component';
import { HomeComponent } from './component/home/home.component';
import { SearchComponent } from './component/search/search.component';

const routes: Routes = [

  { path: '', redirectTo: '/anime', pathMatch: 'full' },
  { path: 'anime', component: HomeComponent },
  { path: 'anime/:id', component: AnimeInfoComponent },
  { path: 'search', component: SearchComponent },
  {path: '**', redirectTo: '/error', pathMatch: 'full'}




];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled',onSameUrlNavigation:'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
