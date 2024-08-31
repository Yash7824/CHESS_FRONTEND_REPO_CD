import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent {

  constructor(
    public dialogRef: MatDialogRef<InboxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiServ: ApiService,
    public cs: CommonService,
    private toastr: ToastrService
  ) { }

  ngOnInit(){
    if(this.cs.IsUndefinedOrNull(this.cs.getFriendRequestList)){
      this.apiServ.gets('social/getPendingFriendRequests').subscribe({
        next: (response) => {
          console.log(response);
          this.cs.getFriendRequestList = response.friendRequest;
        },
        error: (error) => console.error(error)
      })
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  respondFriendReq(action: string, sender_id: string){
    const body = {
      responseToId: sender_id,
      action: action
    }
    this.apiServ.posts('social/respondFriendRequest', body).subscribe({
      next: (response) => {
        let status = response.status
        switch(status){
          case 'accept': this.toastr.success('Friend Request Accepted'); break;
          case 'decline': this.toastr.error('Friend Request Declined'); break;
          default: this.toastr.warning('Invalid response')
        }
      },
      error: (error) => console.error(error)
    })

    this.onNoClick();
  }

}
