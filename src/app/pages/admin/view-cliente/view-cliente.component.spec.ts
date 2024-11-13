import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClienteComponent } from './view-cliente.component';

describe('ViewClienteComponent', () => {
  let component: ViewClienteComponent;
  let fixture: ComponentFixture<ViewClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewClienteComponent]
    });
    fixture = TestBed.createComponent(ViewClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
