import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListCardComponent } from './project-list-card.component';

describe('ProjectListCardComponent', () => {
  let component: ProjectListCardComponent;
  let fixture: ComponentFixture<ProjectListCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectListCardComponent]
    });
    fixture = TestBed.createComponent(ProjectListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
