import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { fromEvent, interval } from 'rxjs';
import { concatMap, exhaustMap, map, mergeMap, switchMap, take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  httpUser: any;
  canvas : any;
  exhaustMapValues : string[];
  mergeMapValues : string[];
  concatMapValues : string[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.init();
  }

  init(){
    this.httpUser = null;
    this.exhaustMapValues = [];
    this.mergeMapValues = [];
    this.concatMapValues = [];
    if(this.canvas) {
      const context = this.canvas.getContext("2d");
      context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.swithcProcess();
    this.switchHttpProcess();
    this.exhaustMapProcess();
    this.mergeMapProcess();
    this.concatMapProcess();
  }

  concatMapProcess(){
    interval(2000)
    .pipe(
      take(3),
      map(
        x=> `outer(${x})`
      ),
      concatMap(
        y => {
          return interval(1000)
                  .pipe(
                    take(4),
                    map(
                      x => `${y}, inner(${x})`
                    )
                  )
        }
      )
    )
    .subscribe(
      x=> {
        this.concatMapValues.push(`Emmited value: ${x}`);
      }
    )
  }

  mergeMapProcess(){
    interval(2000)
    .pipe(
      take(3),
      map(
        x=> `outer(${x})`
      ),
      mergeMap(
        y => {
          return interval(1000)
                  .pipe(
                    take(4),
                    map(
                      x => `${y}, inner(${x})`
                    )
                  )
        }
      )
    )
    .subscribe(
      x=> {
        this.mergeMapValues.push(`Emmited value: ${x}`);
      }
    )
  }

  exhaustMapProcess(){
    interval(1000)
    .pipe(
      take(3),
      map(
        x=> `source(${x})`
      ),
      exhaustMap(
        x => {
          this.exhaustMapValues.push(`Source: ${x}`);
          return interval(300)
                  .pipe(
                    take(5),
                    map(
                      x => `inner(${x*10})`
                    )
                  )
        }
      )
    )
    .subscribe(
      x=> {
        this.exhaustMapValues.push(`Emmited value: ${x}`);
      }
    )
  }

  switchHttpProcess(){
    this.http.get("https://jsonplaceholder.typicode.com/users").pipe(
      switchMap(
        (res: [any]) => {
          return this.http.get("https://jsonplaceholder.typicode.com/users/" + res[0].id);
        }
      )
    )
    .subscribe(
      res => {
        this.httpUser = res;
      }
    );
  }

  swithcProcess(){
    this.canvas = document.querySelector("canvas");
    const context = this.canvas.getContext("2d");

    const moves = fromEvent(this.canvas, 'mousemove');
    const down = fromEvent(this.canvas, 'mousedown');
    const up = fromEvent(this.canvas, "mouseup");

    down.pipe(
      tap(
        (evt: any) =>{
          context.strokeStyle = "green";
          context.beginPath();
          context.moveTo(evt.offsetX, evt.offsetY);
        }
      ),
      switchMap(
        (evt) => moves.pipe(
          map(
            (evt: any) => {
              return { x: evt.offsetX, y: evt.offsetY};
            }
          ),
          takeUntil(up)
        )
      )
    )
    .subscribe(
      (coords) => {
        this.brush(context, coords);
      }
    );
  }

  saveCanvas(){
    var dataURL = this.canvas.toDataURL("image/png");
    var newTab = window.open('about:blank','image from canvas');
    newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");

  }

  brush(context: CanvasRenderingContext2D, coords){
    context.lineWidth = 5;
    context.lineTo(coords.x, coords.y);
    context.stroke();
  }
}
