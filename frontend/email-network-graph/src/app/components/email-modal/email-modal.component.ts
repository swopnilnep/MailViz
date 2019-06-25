import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'; 

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.css']
})
export class EmailModalComponent implements OnInit {

  title: string;
  closeBtnName: string;

  domains: string[] = [];
  interactions: any[] = [];

  constructor(private bsModalRef: BsModalRef, bsModalService: BsModalService) {}

  ngOnInit() { }

}
