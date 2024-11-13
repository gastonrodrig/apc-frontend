import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProveedorComponent } from './view-proveedor.component';

describe('ViewProveedorComponent', () => {
  let component: ViewProveedorComponent;
  let fixture: ComponentFixture<ViewProveedorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewProveedorComponent]
    });
    fixture = TestBed.createComponent(ViewProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
