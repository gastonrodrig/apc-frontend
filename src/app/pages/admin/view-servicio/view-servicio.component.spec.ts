import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServicioComponent } from './view-servicio.component';

describe('ViewServicioComponent', () => {
  let component: ViewServicioComponent;
  let fixture: ComponentFixture<ViewServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
