import { Component, OnInit } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-hometopup',
  templateUrl: './hometopup.component.html',
  styleUrls: ['./hometopup.component.css','../admin/admin.component.css']
})
export class HometopupComponent implements OnInit {
   closeResult: string;

  constructor(private modalService: NgbModal) {}

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }

  ngOnInit() {
  }

}
