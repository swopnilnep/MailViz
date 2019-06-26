import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'; 
import { DataService } from '../../services/data.service'
import { Person } from '../../models/person'
import { CsvService } from '../../services/csv.service'

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.css']
})
export class EmailModalComponent implements OnInit {

  // Data Parameters
  title: string;
  domains;
  participants: Array<Person>;

  // Configuration Parameters
  closeBtnName: string;

  constructor(
    private bsModalRef: BsModalRef,
    private bsModalService: BsModalService,
    private csvDataService: CsvService
    ) {}

  ngOnInit() {

  }

  exportToCsv( itemToExport : string ){
    
    let fileName = this.title + ':' 
      + itemToExport
      + '.csv';
    let objToExport : Object[];

    if ( itemToExport === "domains" )
      objToExport = this.domains;
    else if ( itemToExport === "participants" )
      objToExport = this.participants;

    this.csvDataService.exportToCsv(
      fileName, objToExport
    )
  }

}
