import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InboxComponent } from '../inbox/inbox.component';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

  constructor(public dialog: MatDialog) { }

  openInbox(): void {
    const dialogRef = this.dialog.open(InboxComponent, {
      width: '250px', // Adjust the width as needed
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
