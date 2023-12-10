import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectDialogComponent } from './add-project-dialog.component';

describe('AddProjectDialogComponent', () => {
  let component: AddProjectDialogComponent;
  let fixture: ComponentFixture<AddProjectDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProjectDialogComponent]
    });
    fixture = TestBed.createComponent(AddProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
