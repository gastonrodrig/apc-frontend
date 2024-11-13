import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAlmacenComponent } from './view-almacen.component';

describe('ViewAlmacenComponent', () => {
  let component: ViewAlmacenComponent;
  let fixture: ComponentFixture<ViewAlmacenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewAlmacenComponent]
    });
    fixture = TestBed.createComponent(ViewAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
