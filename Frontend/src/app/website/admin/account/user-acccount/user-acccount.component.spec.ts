import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAcccountComponent } from './user-acccount.component';

describe('UserAcccountComponent', () => {
  let component: UserAcccountComponent;
  let fixture: ComponentFixture<UserAcccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserAcccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAcccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
