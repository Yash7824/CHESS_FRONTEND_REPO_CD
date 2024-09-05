import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { JoinRoomComponent } from './pages/join-room/join-room.component';
import { CreateRoomComponent } from './pages/create-room/create-room.component';
import { GameRoomComponent } from './pages/game-room/game-room.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { SocialComponent } from './pages/social/social.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'join', component: JoinRoomComponent},
  {path: 'create', component: CreateRoomComponent},
  {path: 'game', component: GameRoomComponent },
  {path: 'home', component: HomeComponent },
  {path: 'signUp', component: SignUpComponent },
  {path: 'social', component: SocialComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
