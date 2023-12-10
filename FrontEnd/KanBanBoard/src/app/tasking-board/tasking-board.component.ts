import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { tasks, Task } from '../tasks';
import { ProjectService } from '../project.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';

@Component({
  selector: 'app-tasking-board',
  templateUrl: './tasking-board.component.html',
  styleUrls: ['./tasking-board.component.css']
})
export class TaskingBoardComponent {
  projectId_: any;

  constructor(private router: Router, private projectService: ProjectService, public dialog: MatDialog) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.projectId_ = navigation.extras.state['id'];
      console.log("projectId_");
      console.log(this.projectId_);
    }
  }

  tasks: Task[] = [];

  backlogTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  readyToWorkTasks: Task[] = [];
  blockedTasks: Task[] = [];
  inReviewTasks: Task[] = [];
  doneTasks: Task[] = [];

  ngOnInit() {
    this.projectService.getTasksByProjectId(this.projectId_['key']).subscribe(
      data => {
        if(data) {
          this.tasks = data;
        }else{
          this.tasks = [...tasks];
        }
        this.categorizeTasks();
      },
      error => {
        console.error('There was an error connecting to backend, using placeholders!', error);
        this.tasks = [...tasks];
        this.categorizeTasks();
      }
    );
  }

  categorizeTasks() {
    this.backlogTasks = this.tasks.filter(task => task.state === 'backlog');
    this.inProgressTasks = this.tasks.filter(task => task.state === 'in progress');
    this.readyToWorkTasks = this.tasks.filter(task => task.state === 'ready to work');
    this.blockedTasks = this.tasks.filter(task => task.state === 'blocked');
    this.inReviewTasks = this.tasks.filter(task => task.state === 'in review');
    this.doneTasks = this.tasks.filter(task => task.state === 'done');
  }

  back() {
    //window.alert('The project board has been Opened!');
    this.router.navigate(['']);
  }

  addTask(): void {
    //window.alert('New Project has been added!');
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // ... handle result
      if (result) {
        console.log(result.name, result.description, result.state, result.points, result.date);
        this.projectService.addProject(result.name);
      }
    });
  }

}
