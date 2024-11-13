import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWelcomeComponent } from './user-welcome.component';

describe('UserWelcomeComponent', () => {
  let component: UserWelcomeComponent;
  let fixture: ComponentFixture<UserWelcomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserWelcomeComponent]
    });
    fixture = TestBed.createComponent(UserWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
