import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { JoinRoomComponent } from './pages/join-room/join-room.component';
import { CreateRoomComponent } from './pages/create-room/create-room.component';
import { GameRoomComponent } from './pages/game-room/game-room.component';
import { FormsModule } from '@angular/forms';
import { ChessGameComponent } from './pages/chess-game/chess-game.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { LoginComponent } from './pages/login/login.component';
import { ApiService } from './services/api.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    JoinRoomComponent,
    CreateRoomComponent,
    GameRoomComponent,
    ChessGameComponent,
    SideBarComponent,
    SignUpComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
