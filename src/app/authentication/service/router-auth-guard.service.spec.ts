import { TestBed } from '@angular/core/testing';

import { RouterAuthGuardService } from './router-auth-guard.service';

describe('RouterAuthGuardService', () => {
  let service: RouterAuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouterAuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
