import { TestBed } from '@angular/core/testing';

import { FotosLindasService } from './fotos-lindas.service';

describe('FotosLindasService', () => {
  let service: FotosLindasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FotosLindasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
