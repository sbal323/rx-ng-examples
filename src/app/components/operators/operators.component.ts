import { Component, OnInit } from '@angular/core';
import { interval, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { concatMap, delay, filter, map, pluck, reduce, scan, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.css']
})
export class OperatorsComponent implements OnInit {

  numberNames = ['zero','one','two','three','four','five','six'];
  mapFilterValues: string[];
  pluckValues: string[];
  tapValues: string[];
  scanValues: string[];
  reduceValue: string;

  constructor() { }

  ngOnInit(): void {
    this.init();
  }

  init(){
    this.mapFilterValues = [];
    this.pluckValues = [];
    this.tapValues = [];
    this.scanValues = [];
    this.reduceValue = '';

    this.testMapFilter();
    this.testPluck();
    this.testTap();
    this.testScan();
    this.testReduce();
  }

  testPluck(){
    const users = of(
      {company:{name:'Microsoft'}},
      {company:{name:'Tesla'}},
      {company:{name:'IBM'}},
      {company:{name:'Google'}},
      {company:{name:'Meta'}}
      );
    users
    .pipe(
      concatMap(
        item => of(item).pipe(delay(1000))
        )
      )
    .pipe(
      pluck('company','name')
    )
    .subscribe(
      x=> {
        this.pluckValues.push(x);
      }
    );
  }

  testReduce(){
    interval(100).pipe(
      take(8),
      reduce(
        (acc, value) => {
          const last = acc[value + 1];
          const beforeLast = acc[value];

          return [...acc, last + beforeLast];
        },[0,1]
      )
      )
      .subscribe(
        x=> {
          this.reduceValue = x.join(', ');
        }
      )

  }

  testScan(){
    interval(500).pipe(
      take(8),
      scan(
        (acc, value) => {
          const last = acc[value + 1];
          const beforeLast = acc[value];

          return [...acc, last + beforeLast];
        },[0,1]
      )
      )
      .subscribe(
        x=> {
          this.scanValues.push(x.join(', '));
        }
      )
  }

  testMapFilter(){
    const test = interval(1000).pipe(take(7));
    test.pipe(
      filter(
        (x) => {
          return x % 2 === 0;
        }
      ),
      map(
        (x) => {
          return this.numberNames[x];
        }
      )
    )
    .subscribe(
      x=> {
        this.mapFilterValues.push(x);
      }
    )
  }

  testTap(){
    const test = interval(1000).pipe(take(5));
    test.pipe(
      map(
        (x) => {
          return Math.pow(x, 2);
        }
      ),
      tap(
        (x) =>{
          this.tapValues.push("Value after x^2 = " + x);
        }
      ),
      map(
        (x) => {
          return Math.sqrt(x);
        }
      )
    )
    .subscribe(
      x=> {
        this.tapValues.push("Final value = " + x);
      }
    )
  }
}
