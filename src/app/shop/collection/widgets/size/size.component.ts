import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../../shared/classes/product';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss']
})
export class SizeComponent implements OnInit {

  public collapse: boolean = true;

  constructor() { 
  }

  ngOnInit(): void {
  }



}
