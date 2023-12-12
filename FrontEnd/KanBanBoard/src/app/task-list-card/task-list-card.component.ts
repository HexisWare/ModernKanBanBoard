import { Component, Input } from '@angular/core';

import { ProjectService } from '../project.service';

@Component({
  selector: 'app-task-list-card',
  templateUrl: './task-list-card.component.html',
  styleUrls: ['./task-list-card.component.css']
})
export class TaskListCardComponent {
  @Input() task: any;

  constructor(private projectService: ProjectService) {}

  deleteTask(id: number) {
    console.log(id);
    this.projectService.deleteTaskById(id).subscribe(
      response => {
        console.log('Delete response:', response);
      },
      error => {
        console.error('There was an error connecting to backend, cant delete Task!', error);
        console.error('Delete error:', error);
      }
    );
  }

}
