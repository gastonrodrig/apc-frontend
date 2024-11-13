import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarAlmacenComponent } from './actualizar-almacen.component';

describe('ActualizarAlmacenComponent', () => {
  let component: ActualizarAlmacenComponent;
  let fixture: ComponentFixture<ActualizarAlmacenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarAlmacenComponent]
    });
    fixture = TestBed.createComponent(ActualizarAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
