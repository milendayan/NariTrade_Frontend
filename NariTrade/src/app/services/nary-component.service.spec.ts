import { TestBed } from '@angular/core/testing';

import { NaryComponentService } from './nary-component.service';

describe('NaryComponentService', () => {
  let service: NaryComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NaryComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
