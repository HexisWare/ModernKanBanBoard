import { Component } from '@angular/core';

import { ProjectService } from '../project.service';
import { MatDialog } from '@angular/material/dialog';
import { AddProjectDialogComponent } from '../add-project-dialog/add-project-dialog.component';


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {

  constructor(private projectService: ProjectService,public dialog: MatDialog) {}

  addProject(): void {
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.refresh) {
        this.projectService.notifyRefresh();
      }
    });
  }
}
