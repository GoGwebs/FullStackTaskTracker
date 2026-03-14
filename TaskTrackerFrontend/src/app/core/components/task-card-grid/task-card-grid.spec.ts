import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCardGrid } from './task-card-grid';

describe('TaskCardGrid', () => {
  let component: TaskCardGrid;
  let fixture: ComponentFixture<TaskCardGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskCardGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
