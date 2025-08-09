import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicsidebarComponent } from './musicsidebar.component';

describe('MusicsidebarComponent', () => {
  let component: MusicsidebarComponent;
  let fixture: ComponentFixture<MusicsidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MusicsidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
