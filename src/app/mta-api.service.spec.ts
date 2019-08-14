import { TestBed } from '@angular/core/testing';

import { MtaApiService } from './mta-api.service';

describe('MtaApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MtaApiService = TestBed.get(MtaApiService);
    expect(service).toBeTruthy();
  });
});
