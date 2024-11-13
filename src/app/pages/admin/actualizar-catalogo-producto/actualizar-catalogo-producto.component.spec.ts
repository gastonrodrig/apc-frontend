import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarCatalogoProductoComponent } from './actualizar-catalogo-producto.component';

describe('ActualizarCatalogoProductoComponent', () => {
  let component: ActualizarCatalogoProductoComponent;
  let fixture: ComponentFixture<ActualizarCatalogoProductoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarCatalogoProductoComponent]
    });
    fixture = TestBed.createComponent(ActualizarCatalogoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
