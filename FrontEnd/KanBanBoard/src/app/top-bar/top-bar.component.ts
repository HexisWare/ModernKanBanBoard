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
    //window.alert('New Project has been added!');
    const dialogRef = this.dialog.open(AddProjectDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // ... handle result
      if (result) {
        console.log(result.name, result.description);
        this.projectService.addProject(result);
      }
    });
  }
}
