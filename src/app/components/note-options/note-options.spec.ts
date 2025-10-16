import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteOptions } from './note-options';

describe('NoteOptions', () => {
  let component: NoteOptions;
  let fixture: ComponentFixture<NoteOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteOptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteOptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

