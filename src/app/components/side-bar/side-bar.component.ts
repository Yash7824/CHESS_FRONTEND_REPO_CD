import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InboxComponent } from '../inbox/inbox.component';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

  constructor(public dialog: MatDialog, 
    public cs: CommonService,
  private router: Router) { }

  openInbox(): void {
    const dialogRef = this.dialog.open(InboxComponent, {
      width: '250px', // Adjust the width as needed
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  logout(){
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigateByUrl('');
    this.cs.isLoggedIn = false;
    this.cs.homeLoaded = false;
    this.cs.socialLoaded = false;
  }
}
