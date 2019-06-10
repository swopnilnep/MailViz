import { TestBed } from '@angular/core/testing';

import { DataRetrieveBaseService } from './data-retrieve-base.service';

describe('DataRetrieveBaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataRetrieveBaseService = TestBed.get(DataRetrieveBaseService);
    expect(service).toBeTruthy();
  });
});
