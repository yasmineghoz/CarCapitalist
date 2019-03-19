import { Component } from '@angular/core';
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
}
