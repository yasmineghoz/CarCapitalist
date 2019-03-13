import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../world';
import { apiUrl } from './api';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: Product;
  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  constructor() { }

  getImage() {
    return apiUrl + this.product.logo;
  }

  ngOnInit() {
  }
}
