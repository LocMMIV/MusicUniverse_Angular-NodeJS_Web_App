import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnichartComponent } from './unichart.component';

describe('UnichartComponent', () => {
  let component: UnichartComponent;
  let fixture: ComponentFixture<UnichartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnichartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnichartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
