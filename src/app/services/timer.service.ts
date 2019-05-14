import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

/* Interfaces */
import { Clock } from '@domain/Clock';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  schedulesRef: Observable<any>;
  currentSchedule: any;


  timer: Clock;

  constructor(db: AngularFireDatabase) {
    this.timer = {} as Clock;
    this.schedulesRef = db.list('schedule').valueChanges();
    this.initializeTimer();
  }

  private loadSchedules(): Promise<any>{
    return new Promise((resolve) =>{
      this.schedulesRef.subscribe((data: Array<any>) => {
        this.currentSchedule = data.filter( (item) => {
          const today = new Date();
          const start = new Date();
          const finish = new Date();
          const delivery = new Date();
          
          start.setHours(item.start.split(':')[0]);
          start.setMinutes(item.start.split(':')[1]);
          finish.setHours(item.finish.split(':')[0]);
          finish.setMinutes(item.finish.split(':')[1]);
          delivery.setHours(item.delivery.split(':')[0]);
          delivery.setMinutes(item.delivery.split(':')[1]);

          item.start = start
          item.finish = finish
          item.delivery = delivery
                    
          return  today  > start  && today < finish;
        });
        resolve();
      })
    });
  }

  private async initializeTimer(){
    await this.loadSchedules();

    console.log(this.currentSchedule);

    const dateFinish: Date = new Date(this.currentSchedule[0].finish);
    let countDownDate = dateFinish.getTime();
    let now = new Date().getTime();

    let distance = countDownDate - now;

    this.timer.hour = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.timer.minute = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.timer.second = Math.floor((distance % (1000 * 60)) / 1000);

    setInterval( () => {
      let countDownDate = dateFinish.getTime();
      let now = new Date().getTime();

      let distance = countDownDate - now;

      this.timer.hour = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.timer.minute = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.timer.second = Math.floor((distance % (1000 * 60)) / 1000);

      console.log(this.timer);
    }, 1000);
  }

  getTimer(): Clock {
    return this.timer;
  }
}
