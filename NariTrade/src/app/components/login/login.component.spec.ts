import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.services';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Crear espías para los servicios
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, CommonModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.login and navigate on success', () => {
    component.correo = 'test@example.com';
    component.clave = '123456';
    authServiceSpy.login.and.returnValue(of({ token: 'fake-token' }));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', '123456');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should set errorMessage if fields are empty', () => {
    component.correo = '';
    component.clave = '';
    component.onSubmit();

    expect(component.errorMessage).toBe('Todos los campos son obligatorios.');
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should set errorMessage on login failure', () => {
    component.correo = 'test@example.com';
    component.clave = 'wrongpass';
    authServiceSpy.login.and.returnValue(throwError(() => ({
      error: { message: 'Credenciales incorrectas' }
    })));

    component.onSubmit();

    expect(component.errorMessage).toBe('Credenciales incorrectas');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
