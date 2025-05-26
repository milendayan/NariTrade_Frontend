import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.services';
import { Router } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;

  const mockAuthService = {
    currentUserValue: {
      _id: 'user123',
      correo: 'test@example.com',
      rol: 'user'
    },
    clearCurrentUser: jasmine.createSpy('clearCurrentUser')
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no quedan requests pendientes
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call listarProductos and load data', () => {
    const mockProductos = [{ id: 1, nombre: 'Producto A' }];
    
    const req = httpMock.expectOne('http://localhost:3070/NariTrade/comercio/items');
    expect(req.request.method).toBe('GET');
    req.flush(mockProductos);

    expect(component.productos.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  });

  it('should set productoSeleccionado correctly', () => {
    component.seleccionarMiProducto('prod123');
    expect(component.productoSeleccionado).toBe('prod123');
  });

  it('should navigate to login on logout', () => {
    component.logout();
    expect(mockAuthService.clearCurrentUser).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
