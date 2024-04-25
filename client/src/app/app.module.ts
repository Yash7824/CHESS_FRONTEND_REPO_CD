import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { JoinRoomComponent } from './pages/join-room/join-room.component';
import { CreateRoomComponent } from './pages/create-room/create-room.component';
import { GameRoomComponent } from './pages/game-room/game-room.component';
import { FormsModule } from '@angular/forms';
import { ChessGameComponent } from './pages/chess-game/chess-game.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    JoinRoomComponent,
    CreateRoomComponent,
    GameRoomComponent,
    ChessGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
