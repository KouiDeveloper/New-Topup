import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  page = 1;

  constructor() { }

  ngOnInit() {
  }

}
