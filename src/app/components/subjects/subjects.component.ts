import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, interval, ReplaySubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {

  subjectValues: string[];
  behaviourValues: string[];
  replayValues: string[];

  constructor() { }

  ngOnInit(): void {
    this.init();
  }

  init(){
    this.subjectValues = [];
    this.subjectProcess();
    this.behaviourValues = [];
    this.behaviourProcess();
    this.replayValues = [];
    this.replayProcess();
  }

  replayProcess(){
    const subj = new ReplaySubject();

    interval(1000).pipe(
      take(3)
    )
    .subscribe(x=> subj.next(x));

    subj.subscribe(
      x=>{
        this.replayValues.push(`subscriber 1: ${x}`)
      }
    );

    setTimeout(
      ()=>{
        subj.subscribe(
          x=>{
            this.replayValues.push(`subscriber 2: ${x}`)
          }
        );
      },4000
    );
  }

  behaviourProcess(){
    const subj = new BehaviorSubject(-1);

    interval(1000).pipe(
      take(5)
    )
    .subscribe(x=> subj.next(x));

    subj.subscribe(
      x=>{
        this.behaviourValues.push(`subscriber 1: ${x}`)
      }
    );

    setTimeout(
      ()=>{
        subj.subscribe(
          x=>{
            this.behaviourValues.push(`subscriber 2: ${x}`)
          }
        );
      },2000
    );
  }

  subjectProcess(){
    const subj = new Subject();

    interval(1000).pipe(
      take(5)
    )
    .subscribe(x=> subj.next(x));

    subj.subscribe(
      x=>{
        this.subjectValues.push(`subscriber 1: ${x}`)
      }
    );

    setTimeout(
      ()=>{
        subj.subscribe(
          x=>{
            this.subjectValues.push(`subscriber 2: ${x}`)
          }
        );
      },2000
    );
  }
}
