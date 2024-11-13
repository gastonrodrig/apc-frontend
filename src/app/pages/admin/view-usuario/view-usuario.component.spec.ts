import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUsuarioComponent } from './view-usuario.component';

describe('ViewUsuarioComponent', () => {
  let component: ViewUsuarioComponent;
  let fixture: ComponentFixture<ViewUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUsuarioComponent]
    });
    fixture = TestBed.createComponent(ViewUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
