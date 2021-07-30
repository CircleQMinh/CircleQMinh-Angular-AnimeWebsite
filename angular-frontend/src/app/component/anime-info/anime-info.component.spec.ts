import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimeInfoComponent } from './anime-info.component';

describe('AnimeInfoComponent', () => {
  let component: AnimeInfoComponent;
  let fixture: ComponentFixture<AnimeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimeInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
