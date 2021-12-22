import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MainComponent } from './components/main/main.component';
import { TestComponent } from './components/test/test.component';
import { CreatorsComponent } from './components/creators/creators.component';
import { OperatorsComponent } from './components/operators/operators.component';
import { MapsComponent } from './components/maps/maps.component';
import { HttpClientModule } from '@angular/common/http';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { RateComponent } from './components/rate/rate.component';

@NgModule({
  declarations: [
    MainComponent,
    TestComponent,
    CreatorsComponent,
    OperatorsComponent,
    MapsComponent,
    SubjectsComponent,
    RateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class AppModule { }
