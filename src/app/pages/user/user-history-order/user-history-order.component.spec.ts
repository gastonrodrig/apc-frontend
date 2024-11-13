import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHistoryOrderComponent } from './user-history-order.component';

describe('UserHistoryOrderComponent', () => {
  let component: UserHistoryOrderComponent;
  let fixture: ComponentFixture<UserHistoryOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserHistoryOrderComponent]
    });
    fixture = TestBed.createComponent(UserHistoryOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
