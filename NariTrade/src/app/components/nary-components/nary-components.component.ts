import { Component } from '@angular/core';
import { NaryComponentService } from '../../services/nary-component.service';

@Component({
  selector: 'app-nary-components',
  imports: [],
  templateUrl: './nary-components.component.html',
  styleUrl: './nary-components.component.css',
})
export class NaryComponentsComponent {
  naryList: any = [];

  constructor(private naryService: NaryComponentService) {}
  getAllAnimals() {
    this.naryService.getAllnaryData().subscribe((data: {}) => {
      this.naryList = data;
    });
  }
  ngOnInit() {
    this.getAllAnimals();
  }
}
