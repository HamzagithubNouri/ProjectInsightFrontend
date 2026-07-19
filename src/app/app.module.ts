import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentLayoutModule } from './layouts/student-layout/student-layout.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StudentLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
