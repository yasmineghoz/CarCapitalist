import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Product } from '../world';
import { apiUrl } from './api';

declare var require;
const ProgressBar = require('progressbar.js');

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: Product;

  @ViewChild('bar') progressBarItem;
  progressbar: any;

  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  constructor() { }

  getImage() {
    return apiUrl + this.product.logo;
  }

  startFabrication() {
    this.progressbar.set(0);
    this.progressbar.animate(1, { duration: this.product.vitesse });
  }

  ngOnInit() {
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, {
      strokeWidth: 50, color:
        '#00ff00'
    });
    this.progressbar.animate(1, { duration: this.product.vitesse });
  }
}
