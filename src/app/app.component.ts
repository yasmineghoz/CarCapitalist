import { Component, Input } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { apiUrl } from './api';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ToasterService]
})
export class AppComponent {
  title = 'CarCapitalist';

  world: World = new World();
  server: string;

  rate: string;
  rates: string[] = ['1', '10', '100', 'Max'];
  rateIndex = 0;

  toasterService: ToasterService;

  username: string;

  constructor(private service: RestserviceService, toasterService: ToasterService) {
    this.rate = this.rates[this.rateIndex];
    this.server = service.server;
    this.toasterService = toasterService;

    service.getWorld().then(
      world => {
        this.world = world;
      });
  }

  onUsernameChanged() {
    localStorage.setItem('username', this.username);
    this.service.setUser(this.username);
  }

  onProductionDone(p: Product) {
    this.world.money = this.world.money + p.revenu * p.quantite;
    this.world.score = this.world.score + p.revenu * p.quantite;
    this.newManager();
  }

  buyRate() {
    this.rateIndex = (this.rateIndex + 1) % this.rates.length;
    this.rate = this.rates[this.rateIndex];
  }

  onProductBuy(cost: number): void {
    if (this.world.money >= cost) {
      this.world.money -= cost;
    }
    this.newManager();
  }

  buyManager(cost: number, id: number): void {
    this.world.money -= cost;
    for (const manager of this.world.managers.pallier) {
      if (manager.idcible === id) {
        manager.unlocked = true;
        this.toasterService.pop('success', 'Manager Embauché !', manager.name);
      }
    }
    for (const product of this.world.products.product) {
      if (product.id === id) {
        product.managerUnlocked = true;
      }
    }
  }

  newManager() {
    for (const manager of this.world.managers.pallier) {
      if (this.world.money >= manager.seuil && manager.unlocked === false) {
        document.getElementById('btnManagers').innerHTML = '<span class="badge">New</span> Managers';
        break;
      } else {
        document.getElementById('btnManagers').innerHTML = 'Managers';
      }
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.username = localStorage.getItem('username');
    if (this.username == null) {
      this.username = 'Captain' + Math.floor(Math.random() * 10000);
      localStorage.setItem('username', this.username);
    }
  }
}
