import { TestBed } from '@angular/core/testing';

import { InfomationService } from './infomation.service';

describe('InfomationService', () => {
  let service: InfomationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfomationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
