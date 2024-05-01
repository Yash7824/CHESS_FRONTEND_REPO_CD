import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  constructor(private router: Router,
    private apiServ: ApiService
  ) {}
  
  ngOnInit(): void {
    this.apiServ.getUser().subscribe({
      next: (response) => {
        console.log(response);
      },
      error: err => console.error('Observable emitted an error: ' + err),
      complete: () => console.log('Observable emitted the complete notification')
    })
  }


  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
