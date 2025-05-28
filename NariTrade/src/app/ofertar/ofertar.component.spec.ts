import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertarComponent } from './ofertar.component';

describe('OfertarComponent', () => {
  let component: OfertarComponent;
  let fixture: ComponentFixture<OfertarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfertarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
