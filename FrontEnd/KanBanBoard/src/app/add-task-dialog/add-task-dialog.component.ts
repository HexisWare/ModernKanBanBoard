import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.css']
})
export class AddTaskDialogComponent {
  name: string = '';
  description: string = '';
  points: number = 0;
  date: string = '';
  projectOf: number = 0;
  state: string = '';

  constructor(public dialogRef: MatDialogRef<AddTaskDialogComponent>,private projectService: ProjectService) {}

  onSave(): void {
    const formData = {name: this.name, description: this.description, points: Number(this.points), date: this.date, state: this.state};

    this.projectService.addTaskByprojectId(formData, Number(this.projectOf)).subscribe(
      response => {
        this.dialogRef.close();
      },
      error => {
        console.error('There was an error connecting to backend, cant add Project!', error);
        this.dialogRef.close();
      }
    );
  }
}
