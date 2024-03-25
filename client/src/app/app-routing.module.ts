import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { JoinRoomComponent } from './pages/join-room/join-room.component';
import { CreateRoomComponent } from './pages/create-room/create-room.component';
import { GameRoomComponent } from './pages/game-room/game-room.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'join', component: JoinRoomComponent},
  {path: 'create', component: CreateRoomComponent},
  {path: 'game', component: GameRoomComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
