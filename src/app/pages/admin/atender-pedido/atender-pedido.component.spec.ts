import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtenderPedidoComponent } from './atender-pedido.component';

describe('AtenderPedidoComponent', () => {
  let component: AtenderPedidoComponent;
  let fixture: ComponentFixture<AtenderPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtenderPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtenderPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
