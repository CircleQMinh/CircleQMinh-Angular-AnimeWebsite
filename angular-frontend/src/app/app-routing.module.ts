import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnimeInfoComponent } from './component/anime-info/anime-info.component';
import { CharacterInfoComponent } from './component/character-info/character-info.component';
import { CharacterComponent } from './component/character/character.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { MangaInfoComponent } from './component/manga-info/manga-info.component';
import { MangaComponent } from './component/manga/manga.component';
import { PasswordRecoverComponent } from './component/password-recover/password-recover.component';
import { ProfileComponent } from './component/profile/profile.component';
import { ReadComponent } from './component/read/read.component';
import { RegisterComponent } from './component/register/register.component';
import { SearchComponent } from './component/search/search.component';
import { WatchComponent } from './component/watch/watch.component';

const routes: Routes = [

  { path: '', redirectTo: '/anime', pathMatch: 'full' },
  { path: 'anime', component: HomeComponent },
  { path: 'manga', component: MangaComponent },
  { path: 'watch/:id', component: WatchComponent },
  { path: 'read/:id', component: ReadComponent },
  { path: 'anime/:id', component: AnimeInfoComponent },
  { path: 'manga/:id', component: MangaInfoComponent },
  { path: 'search/:url', component: SearchComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'character', component: CharacterComponent },
  { path: 'character/:id', component: CharacterInfoComponent },
  { path: 'password-recover', component: PasswordRecoverComponent },
  {path: 'search', redirectTo: '/search/anime', pathMatch: 'full'},
  {path: '**', redirectTo: '/error', pathMatch: 'full'}




];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled',onSameUrlNavigation:'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
