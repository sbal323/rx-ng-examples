import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import {ajax} from "rxjs/ajax";

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css']
})
export class RateComponent implements OnInit {

  lastBtc = 0;
  currentBtc = 0;
  lastEth = 0;
  currentEth = 0;

  btcUp(){
    return this.lastBtc <= this.currentBtc;
  }

  btcChange(){
    if(this.currentBtc>this.lastBtc){
      return (this.currentBtc/this.lastBtc-1)*100
    }
    return (1-this.currentBtc/this.lastBtc)*100
  }

  ethChange(){
    if(this.currentEth>this.lastEth){
      return (this.currentEth/this.lastEth-1)*100
    }
    return (1-this.currentEth/this.lastEth)*100
  }

  ethUp(){
    return this.lastEth <= this.currentEth;
  }

  constructor() { }

  ngOnInit(): void {
    interval(10000)
      .subscribe(
        x=> {
          ajax
            .getJSON("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT")
            .subscribe(
              (x:any) => {
                this.lastBtc = this.currentBtc;
                this.currentBtc = x.price;
              }
            );
            ajax
            .getJSON("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT")
            .subscribe(
              (x:any) => {
                this.lastEth = this.currentEth;
                this.currentEth = x.price;
              }
            );
        }
      )
  }

}
