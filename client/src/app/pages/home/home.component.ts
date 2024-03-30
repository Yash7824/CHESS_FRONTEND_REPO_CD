import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { from, isEmpty } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  constructor(private router: Router) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }


  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
