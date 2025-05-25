import { Component } from '@angular/core';

@Component({
  selector: 'app-micomponente',
  imports: [],
  templateUrl: './micomponente.component.html',
  styleUrl: './micomponente.component.css',
})
export class MicomponenteComponent {
  micomponeteList: any = [];

  constructor(private micomponenteService: MicomponenteComponent) {}
  getAllAnimals() {
    this.micomponenteService.getAllmicomponeteData().subscribe((data: {}) => {
      this.micomponeteList = data;
    });
  }
  getAllmicomponeteData() {
    throw new Error('Method not implemented.');
  }
  ngOnInit() {
    this.getAllmicomponete();
  }
  getAllmicomponete() {
    throw new Error('Method not implemented.');
  }
}
