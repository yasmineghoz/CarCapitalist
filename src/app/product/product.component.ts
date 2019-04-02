import { Component, OnInit, Input, ViewChild, Output, EventEmitter, Host, OnChanges, SimpleChanges } from '@angular/core';
import { Product, World } from '../world';
import { apiUrl } from '../api';
import { AppComponent } from '../app.component';

declare var require;
const ProgressBar = require('progressbar.js');

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnChanges {

  world: World;
  product: Product;
  lastupdate: number;
  rateProd: string;
  // tslint:disable-next-line:variable-name
  _money: number;
  revenu: number;

  @ViewChild('bar') progressBarItem;
  progressbar: any;

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

  @Output()
  notifyBuy: EventEmitter<number> = new EventEmitter<number>();

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

    if (this.product.managerUnlocked) {
      if (this.product.timeleft !== 0) {
        this.product.timeleft = this.product.timeleft - elapseTime;
        if (this.product.timeleft <= 0) {
          this.product.timeleft = this.product.vitesse;
          this.notifyProduction.emit(this.product);
          this.startFabrication();
        }
      } else {
        this.startFabrication();
      }

    } else {

      if (this.product.timeleft !== 0) {
        this.product.timeleft = this.product.timeleft - elapseTime;
        if (this.product.timeleft <= 0) {
          this.product.timeleft = 0;
          this.progressbar.set(0);
          this.notifyProduction.emit(this.product);
        }
      }
    }
  }

  calcMaxCanBuy() {
    const qtMax = (Math.log((-this._money * (1 - this.product.croissance)) / this.product.cout + 1)) / Math.log(this.product.croissance);
    return Math.round(qtMax);
  }

  ngOnInit() {
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, {
      strokeWidth: 50, color:
        '#00ff00'
    });
    setInterval(() => { this.calcScore(); }, 100);
    this.revenu = this.product.revenu;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rate) {
      if (changes.rate.currentValue === 'Max') {
        this.rateProd = this.calcMaxCanBuy().toString();
      } else {
        this.rateProd = changes.rate.currentValue;
      }
    }
  }

  updateBuy() {
    if (this._money >= this.product.cout) {
      // tslint:disable-next-line:radix
      this.notifyBuy.emit(this.product.cout * ((1 - Math.pow(this.product.croissance, parseInt(this.rate))) /
        (1 - this.product.croissance)));
      // tslint:disable-next-line:radix
      this.product.quantite += parseInt(this.rate);
      this.revenu = this.product.revenu * this.product.quantite;
      this.product.cout = this.product.cout * this.product.croissance;
      // si quantite produit = seuil de l'unlock associé à l'id du produit, unlock devient true.
    }
  }
}
