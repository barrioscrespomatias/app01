import { TestBed } from '@angular/core/testing';

import { FotosFeasService } from './fotos-feas.service';

describe('FotosFeasService', () => {
  let service: FotosFeasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FotosFeasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
