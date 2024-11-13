import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddAddressesComponent } from './user-add-addresses.component';

describe('UserAddAddressesComponent', () => {
  let component: UserAddAddressesComponent;
  let fixture: ComponentFixture<UserAddAddressesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserAddAddressesComponent]
    });
    fixture = TestBed.createComponent(UserAddAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
