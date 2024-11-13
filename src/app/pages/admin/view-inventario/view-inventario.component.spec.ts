import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInventarioComponent } from './view-inventario.component';

describe('ViewInventarioComponent', () => {
  let component: ViewInventarioComponent;
  let fixture: ComponentFixture<ViewInventarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewInventarioComponent]
    });
    fixture = TestBed.createComponent(ViewInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
