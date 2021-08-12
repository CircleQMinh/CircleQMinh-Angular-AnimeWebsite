import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HotToastModule } from '@ngneat/hot-toast';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './component/home/home.component';
import { NavComponent } from './component/nav/nav.component';
import { FooterComponent } from './component/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchbarComponent } from './component/searchbar/searchbar.component';
import { SearchComponent } from './component/search/search.component';
import { AnimeInfoComponent } from './component/anime-info/anime-info.component';
import { MangaComponent } from './component/manga/manga.component';
import { MangaInfoComponent } from './component/manga-info/manga-info.component';
import { WatchComponent } from './component/watch/watch.component';
import { ReadComponent } from './component/read/read.component';
import { ReadMoreComponent } from './component/read-more/read-more.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { PasswordRecoverComponent } from './component/password-recover/password-recover.component';
import { ProfileComponent } from './component/profile/profile.component';
import { NewsComponent } from './component/news/news.component';
import { CharacterComponent } from './component/character/character.component';
import { CharacterInfoComponent } from './component/character-info/character-info.component';
import { CharacterListComponent } from './component/character-list/character-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    FooterComponent,
    SearchbarComponent,
    SearchComponent,
    AnimeInfoComponent,
    MangaComponent,
    MangaInfoComponent,
    WatchComponent,
    ReadComponent,
    ReadMoreComponent,
    LoginComponent,
    RegisterComponent,
    PasswordRecoverComponent,
    ProfileComponent,
    NewsComponent,
    CharacterComponent,
    CharacterInfoComponent,
    CharacterListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,FormsModule, NgbModule, HotToastModule.forRoot(), BrowserAnimationsModule,
    CollapseModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
