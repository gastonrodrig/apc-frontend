import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCatalogoComponent } from './add-to-catalogo.component';

describe('AddToCatalogoComponent', () => {
  let component: AddToCatalogoComponent;
  let fixture: ComponentFixture<AddToCatalogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddToCatalogoComponent]
    });
    fixture = TestBed.createComponent(AddToCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
