import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Product, World } from '../world';
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
  lastupdate: number;

  @ViewChild('bar') progressBarItem;
  progressbar: any;

  @Input()
  set prod(value: Product) {
    this.product = value;
    this.lastupdate = Date.now();
  }

  constructor() { }

  getImage() {
    return apiUrl + this.product.logo;
  }

  startFabrication() {
    this.progressbar.set(0);
    this.progressbar.animate(1, { duration: this.product.vitesse });
    this.product.timeleft = this.product.vitesse;
  }

  calcScore(){
    let now = Date.now();
    let elapseTime = now - this.lastupdate;
    this.lastupdate = now;

    if (this.product.timeleft != 0){
      this.product.timeleft= this.product.timeleft - elapseTime ;
      //console.log(this.product.timeleft);
      if (this.product.timeleft<=0){
        this.product.timeleft = 0;
        this.progressbar.set(0);
      }
    }
  }

  ngOnInit() {
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, {
      strokeWidth: 50, color:
        '#00ff00'
    });
    setInterval(() => {this.calcScore(); }, 100);

  }
}
