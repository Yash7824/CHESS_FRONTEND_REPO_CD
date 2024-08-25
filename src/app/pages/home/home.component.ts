import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  constructor(private router: Router,
    private apiServ: ApiService,
    private cs: CommonService,
  ) {}

  ngOnInit(): void {
    if(!this.cs.homeLoaded){
      this.apiServ.gets('auth/getUser').subscribe({
        next: (response) => {
          this.cs.getUser = response;
          this.cs.homeLoaded = true;
        },
        error: err => console.error('Observable emitted an error: ' + err)
        // complete: () => console.log('Observable emitted the complete notification')
      })
    }
  }


  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

}
