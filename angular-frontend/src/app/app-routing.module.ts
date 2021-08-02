import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnimeInfoComponent } from './component/anime-info/anime-info.component';
import { HomeComponent } from './component/home/home.component';
import { MangaInfoComponent } from './component/manga-info/manga-info.component';
import { MangaComponent } from './component/manga/manga.component';
import { SearchComponent } from './component/search/search.component';

const routes: Routes = [

  { path: '', redirectTo: '/anime', pathMatch: 'full' },
  { path: 'anime', component: HomeComponent },
  { path: 'manga', component: MangaComponent },
  { path: 'anime/:id', component: AnimeInfoComponent },
  { path: 'manga/:id', component: MangaInfoComponent },
  { path: 'search/:url', component: SearchComponent },
  {path: 'search', redirectTo: '/search/anime', pathMatch: 'full'},
  {path: '**', redirectTo: '/error', pathMatch: 'full'}




];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled',onSameUrlNavigation:'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
