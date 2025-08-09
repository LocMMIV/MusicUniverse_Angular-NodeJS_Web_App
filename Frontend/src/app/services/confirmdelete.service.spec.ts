import { TestBed } from '@angular/core/testing';

import { ConfirmdeleteService } from './confirmdelete.service';

describe('ConfirmdeleteService', () => {
  let service: ConfirmdeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmdeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
