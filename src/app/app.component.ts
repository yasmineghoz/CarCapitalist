import { Component, Input } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CarCapitalist';

  world: World = new World();
  server: string;

  constructor(private service: RestserviceService) {
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
    let text = document.getElementById('buyBtn').innerHTML;
    switch (text) {
      case 'Buy x 1':
        text = 'Buy x 10';
        break;
      case 'Buy x 10':
        text = 'Buy x 100';
        break;
      case 'Buy x 100':
        text = 'Buy Max';
        break;
      case 'Buy Max':
        text = 'Buy x 1';
        break;
    }
  }
}
