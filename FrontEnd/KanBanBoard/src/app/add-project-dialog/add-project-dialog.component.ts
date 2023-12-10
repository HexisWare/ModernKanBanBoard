import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.css']
})
export class AddProjectDialogComponent {
  name: string = '';
  description: string = '';

  constructor(public dialogRef: MatDialogRef<AddProjectDialogComponent>,private projectService: ProjectService) {}

  onSave(): void {
    const formData = {name: this.name, description: this.description};

    this.projectService.addProject(formData).subscribe(
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
