import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { from, isEmpty } from 'rxjs';
import { SocketService } from 'src/app/services/SocketService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router, private socket: SocketService) {}

  ngOnInit() {
  }

  ngAfterViewInit() {}

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
