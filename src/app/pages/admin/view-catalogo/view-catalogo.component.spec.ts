import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCatalogoComponent } from './view-catalogo.component';

describe('ViewCatalogoComponent', () => {
  let component: ViewCatalogoComponent;
  let fixture: ComponentFixture<ViewCatalogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCatalogoComponent]
    });
    fixture = TestBed.createComponent(ViewCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
