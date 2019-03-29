import { Component, Input } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { apiUrl } from './api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CarCapitalist';

  world: World = new World();
  server: string;

  rate: string;
  rates: string[] = ['1', '10', '100', 'Max'];
  rateIndex = 0;

  constructor(private service: RestserviceService) {
    this.rate = this.rates[this.rateIndex];
    this.server = service.server;
    service.getWorld().then(
      world => {
        this.world = world;
      });
  }

  onProductionDone(p: Product) {
    this.world.money = this.world.money + p.revenu * p.quantite;
    this.world.score = this.world.score + p.revenu * p.quantite;
  }

  buyRate() {
    this.rateIndex = (this.rateIndex + 1) % this.rates.length;
    this.rate = this.rates[this.rateIndex];
  }

  onProductBuy(cost: number): void {
    if (this.world.money >= cost) {
      this.world.money -= cost;
    }
  }

  buyManager(cost: number, id: number): void {
    this.world.money -= cost;
    for (const manager of this.world.managers.pallier) {
      if (manager.idcible === id) {
        manager.unlocked = true;
      }
    }
  }
}
