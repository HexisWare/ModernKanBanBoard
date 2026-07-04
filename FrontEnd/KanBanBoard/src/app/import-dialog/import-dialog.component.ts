import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.css']
})
export class ImportDialogComponent {
  jsonText: string = '';
  errorMessage: string = '';
  importing: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.jsonText = e.target?.result as string;
        this.errorMessage = '';
      };
      reader.readAsText(file);
    }
  }

  onImport() {
    this.errorMessage = '';
    let tasks: any[];

    try {
      const parsed = JSON.parse(this.jsonText);
      if (Array.isArray(parsed)) {
        tasks = parsed;
      } else if (parsed.tasks && Array.isArray(parsed.tasks)) {
        tasks = parsed.tasks;
      } else {
        this.errorMessage = 'JSON must be an array of tasks or an object with a "tasks" array';
        return;
      }
    } catch (e) {
      this.errorMessage = 'Invalid JSON: ' + (e as Error).message;
      return;
    }

    if (tasks.length === 0) {
      this.errorMessage = 'No tasks found in JSON';
      return;
    }

    this.importing = true;
    this.projectService.bulkImportTasks(tasks, this.data.projectId).subscribe(
      response => {
        this.importing = false;
        this.dialogRef.close({ refresh: true, inserted: response.inserted });
      },
      error => {
        this.importing = false;
        this.errorMessage = 'Import failed: ' + error.message;
      }
    );
  }
}
