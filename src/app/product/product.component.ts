import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
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
  _money: number;
  _qtmulti: string;

  @ViewChild('bar') progressBarItem;
  progressbar: any;

  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    if (this._qtmulti && this.product) this.calcMaxCanBuy();
  }

  @Input()
  set money(value: number) {
    this._money = value;
    if (this._money && this.product) this.calcMaxCanBuy();
  }

  @Input()
  set prod(value: Product) {
    this.product = value;
    this.lastupdate = Date.now();
  }

  @Output()
  notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

  constructor() { }

  getImage() {
    return apiUrl + this.product.logo;
  }

  startFabrication() {
    this.progressbar.set(0);
    this.progressbar.animate(1, { duration: this.product.vitesse });
    this.product.timeleft = this.product.vitesse;
  }

  calcScore(): void {
    let now = Date.now();
    let elapseTime = now - this.lastupdate;
    this.lastupdate = now;

    if (this.product.timeleft != 0) {
      this.product.timeleft = this.product.timeleft - elapseTime;
      //console.log(this.product.timeleft);
      if (this.product.timeleft <= 0) {
        this.product.timeleft = 0;
        this.progressbar.set(0);
        this.notifyProduction.emit(this.product);
      }
    }
    // on prévient le composant parent que ce produit a généré son revenu.
  }

  calcMaxCanBuy() {
    let qtMax = 0;
    qtMax = (Math.log(1 - (this.money * (1 - this.product.croissance)) / this.product.revenu)) / (Math.log(this.product.croissance)) - 1;
    console.log(qtMax);
  }

  ngOnInit() {
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, {
      strokeWidth: 50, color:
        '#00ff00'
    });
    setInterval(() => { this.calcScore(); }, 100);
  }
}
