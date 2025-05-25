import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaryComponentsComponent } from './nary-components.component';

describe('NaryComponentsComponent', () => {
  let component: NaryComponentsComponent;
  let fixture: ComponentFixture<NaryComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NaryComponentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaryComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
