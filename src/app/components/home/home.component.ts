import { Component, OnInit } from '@angular/core';
declare const excecuteTemplateScript: any;

/* Services */
import { TimerService } from '@services/timer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  constructor(private timerService: TimerService) {
    
  }

  ngOnInit() {
    excecuteTemplateScript();
  }

}
