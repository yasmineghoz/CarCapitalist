import { Component, OnInit, Input, ViewChild, Output, EventEmitter, Host, OnChanges, SimpleChanges } from '@angular/core';
import { Product, World } from '../world';
import { apiUrl } from './api';
import { AppComponent } from '../app.component';

declare var require;
const ProgressBar = require('progressbar.js');

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnChanges {

  product: Product;
  lastupdate: number;
  rateProd: string;
  // tslint:disable-next-line:variable-name
  _money: number;
  // tslint:disable-next-line:variable-name
  _qtmulti: string;

  @ViewChild('bar') progressBarItem;
  progressbar: any;

  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    if (this._qtmulti && this.product) { this.calcMaxCanBuy(); }
  }

  @Input()
  set money(value: number) {
    this._money = value;
    if (this._money && this.product) { this.calcMaxCanBuy(); }
  }

  @Input()
  set prod(value: Product) {
    this.product = value;
    this.lastupdate = Date.now();
  }

  @Input() rate: string;

  @Output()
  notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

  constructor(@Host() parent: AppComponent) { }

  getImage() {
    return apiUrl + this.product.logo;
  }

  startFabrication() {
    this.progressbar.set(0);
    this.progressbar.animate(1, { duration: this.product.vitesse });
    this.product.timeleft = this.product.vitesse;
  }

  calcScore(): void {
    const now = Date.now();
    const elapseTime = now - this.lastupdate;
    this.lastupdate = now;

    if (this.product.timeleft !== 0) {
      this.product.timeleft = this.product.timeleft - elapseTime;
      // console.log(this.product.timeleft);
      if (this.product.timeleft <= 0) {
        this.product.timeleft = 0;
        this.progressbar.set(0);
        this.notifyProduction.emit(this.product);
      }
    }
    // on prévient le composant parent que ce produit a généré son revenu.
  }

  calcMaxCanBuy() {
    console.log('money' + this._money);
    console.log('%' + this.product.croissance);
    console.log('revenu' + this.product.revenu);
    const qtMax = (Math.log((-this._money * (1 - this.product.croissance)) / this.product.revenu + 1)) / Math.log(this.product.croissance);
    return qtMax;
  }

  ngOnInit() {
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, {
      strokeWidth: 50, color:
        '#00ff00'
    });
    setInterval(() => { this.calcScore(); }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rate.currentValue === 'Max') {
      this.rateProd = this.calcMaxCanBuy().toString();
    } else {
      this.rateProd = changes.rate.currentValue;
    }
  }
}
