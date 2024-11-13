import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductoComponent } from './view-producto.component';

describe('ViewProductoComponent', () => {
  let component: ViewProductoComponent;
  let fixture: ComponentFixture<ViewProductoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewProductoComponent]
    });
    fixture = TestBed.createComponent(ViewProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
