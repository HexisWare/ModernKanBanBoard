import { Component, Inject } from '@angular/core';
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
  state: string = '';
  priority: number = 0;
  projectId: number = 0;
  boardType: string = 'project';

  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.projectId = data.projectId || 0;
      this.boardType = data.boardType || 'project';
      if (this.boardType === 'content') {
        this.state = 'video';
      } else {
        this.state = 'backlog';
      }
    }
    this.date = new Date().toISOString().split('T')[0];
  }

  onDateChange(value: any): void {
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      this.date = `${year}-${month}-${day}`;
    }
  }

  onSave(): void {
    const formData = {name: this.name, description: this.description, points: Number(this.points), date: this.date, state: this.state, priority: Number(this.priority)};

    this.projectService.addTaskByprojectId(formData, Number(this.projectId)).subscribe(
      response => {
        this.dialogRef.close({ refresh: true });
      },
      error => {
        console.error('There was an error connecting to backend, cant add Task!', error);
        this.dialogRef.close();
      }
    );
  }
}
