import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { from, fromEvent, interval, of, range } from 'rxjs';
import {fromFetch} from "rxjs/fetch";
import {concatMap, delay, map, switchMap, take} from "rxjs/operators";

@Component({
  selector: 'app-creators',
  templateUrl: './creators.component.html',
  styleUrls: ['./creators.component.css']
})
export class CreatorsComponent implements OnInit {
  public users: string[];
  public numbers: number[] = [];
  public fruits: string[] = [];
  public events: string[] = [];
  public numbers2: number[] = [];
  public range: number[] = [];
  public clock: string = "";

  @ViewChild("buttonElem") buttonElem: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    this.processEvents();
  }

  ngOnInit(): void {
    this.init();
  }

  init(){
    this.setDate();
    this.users = [];
    this.numbers = [];
    this.fruits = [];
    this.events = [];
    this.numbers2 = [];
    this.range = [];
    this.processUsers();
    this.processNumbers();
    this.processFruits();
    this.processInterval();
    this.processRange();
    this.processClock();
  }

  setDate(){
    const date = new Date();
    this.clock = `${("0" + date.getHours()).slice(-2)} : ${("0" + date.getMinutes()).slice(-2)} : ${("0" + date.getSeconds()).slice(-2)}`;
  }

  processClock(){
    interval(1000)
    .subscribe(
      () => {
        this.setDate();
      }
    )
  }

  processRange(){
    range(50,10)
    .pipe(
      concatMap(
        value => of(value).pipe(delay(1000))
      )
    )
    .subscribe(
      n => this.range.push(n)
    )
  }

  processInterval(){
    interval(1500)
    .pipe(
      map(
        x=> x+1
      ),
      take(5)
    )
    .subscribe(
      n => this.numbers2.push(n)
    )
  }

  processEvents(){
    //const el = document.getElementById("btnTest");
    const evs = fromEvent(this.buttonElem.nativeElement, 'click');

    evs.subscribe(
      ev => this.events.push("Button clicked")
    );
  }

  processNumbers(){
    const nums = of(1,2,3,4,5,6);

    nums.subscribe(
      n => this.numbers.push(n)
    );
  }

  processFruits(){
    const fruits = from(['apple', 'orange', 'grape', 'lemon']);

    fruits.subscribe(
      f => this.fruits.push(f)
    );
  }

  processUsers(){
    const users = fromFetch("https://jsonplaceholder.typicode.com/users")
    .pipe(
      switchMap(
        result => {
          return result.json()
        }
      )
    )
    .subscribe(
      result => {
        this.users = result;
      }
    )
  }

}
