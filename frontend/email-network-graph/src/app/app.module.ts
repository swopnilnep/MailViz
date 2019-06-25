// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';

// Project Components
import { AppComponent } from './components/app/app.component';
import { GraphComponent } from './components/graph/graph.component';
import { MenuComponent } from './components/menu/menu.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { EmailModalComponent } from './components/email-modal/email-modal.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    MenuComponent,
    TimelineComponent,
    EmailModalComponent,
    DateRangePickerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents : [EmailModalComponent]
})
export class AppModule { }
