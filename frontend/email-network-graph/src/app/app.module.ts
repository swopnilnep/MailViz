// External or Angular Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';

// Project Components
import { AppComponent } from './components/app/app.component';
import { GraphComponent } from './components/graph/graph.component';
import { MenuComponent } from './components/menu/menu.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { EmailModalComponent } from './components/email-modal/email-modal.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';

// Providers
import { DataService } from './services/data.service';
import { NetworkSelectionService } from './services/network-selection.service';

// Plotting Modules
// import * as PlotlyJS from 'plotly.js/dist/plotly.js'; // MIT License
// import { PlotlyModule } from 'angular-plotly.js'; // MIT License

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
    // PlotlyModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot()
  ],
  providers: [DataService, NetworkSelectionService],
  bootstrap: [AppComponent],
  entryComponents : [EmailModalComponent]
})
export class AppModule { }
