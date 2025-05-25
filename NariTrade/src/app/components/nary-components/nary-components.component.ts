import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { NaryComponentService } from '../../services/nary-component.service';

@Component({
  selector: 'app-nary-components',
  imports: [],
  templateUrl: './nary-components.component.html',
  styleUrl: './nary-components.component.css',
})
export class NaryComponentsComponent {
  naryList: any = [];
  nariForm: FormGroup | any;
  constructor(private naryService: NaryComponentService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService) {
  }
  getAllAnimals() {
    this.naryService.getAllnaryData().subscribe((data: {}) => {
      this.naryList = data;
    });
  }
  newMessage(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  ngOnInit() {
    this.nariForm = this.formBuilder.group({
      nombre: '',
      edad: 0,
      tipo: ''
    });

  }
  newAnimalEntry() {
    this.naryService.newnary(this.nariForm.value).subscribe(
      () => {
        //Redirigiendo a la ruta actual /inicio y recargando la ventana
        this.router.navigate(['/inicio'])
          .then(() => {
            this.newMessage('Registro exitoso');
          })
      }
    );
  }
}
