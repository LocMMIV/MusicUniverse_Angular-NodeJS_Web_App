import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSongComponent } from './detail-song.component';

describe('DetailSongComponent', () => {
  let component: DetailSongComponent;
  let fixture: ComponentFixture<DetailSongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailSongComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
