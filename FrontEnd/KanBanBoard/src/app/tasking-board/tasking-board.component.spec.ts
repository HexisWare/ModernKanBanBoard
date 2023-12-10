import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskingBoardComponent } from './tasking-board.component';

describe('TaskingBoardComponent', () => {
  let component: TaskingBoardComponent;
  let fixture: ComponentFixture<TaskingBoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskingBoardComponent]
    });
    fixture = TestBed.createComponent(TaskingBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
