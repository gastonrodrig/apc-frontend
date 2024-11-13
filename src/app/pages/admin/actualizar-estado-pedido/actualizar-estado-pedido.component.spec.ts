import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarEstadoPedidoComponent } from './actualizar-estado-pedido.component';

describe('ActualizarEstadoPedidoComponent', () => {
  let component: ActualizarEstadoPedidoComponent;
  let fixture: ComponentFixture<ActualizarEstadoPedidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarEstadoPedidoComponent]
    });
    fixture = TestBed.createComponent(ActualizarEstadoPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
