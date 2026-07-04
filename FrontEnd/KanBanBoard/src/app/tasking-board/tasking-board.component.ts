import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { tasks, Task } from '../tasks';
import { ProjectService } from '../project.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../add-task-dialog/add-task-dialog.component';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tasking-board',
  templateUrl: './tasking-board.component.html',
  styleUrls: ['./tasking-board.component.css']
})
export class TaskingBoardComponent {
  projectId_: any;
  boardType: string = 'project';
  projectName: string = '';
  ideas: string = '';
  gameDevDoc: string = '';
  gameDevDocName: string = '';
  prototypeLink: string = '';
  liveLink: string = '';
  private ideasTimer: any;
  private prototypeLinkTimer: any;
  private liveLinkTimer: any;

  constructor(private router: Router, private projectService: ProjectService, public dialog: MatDialog) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.projectId_ = navigation.extras.state['id'];
    }
  }

  tasks: Task[] = [];

  backlogTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  readyToWorkTasks: Task[] = [];
  blockedTasks: Task[] = [];
  inReviewTasks: Task[] = [];
  doneTasks: Task[] = [];

  videoTasks: Task[] = [];
  uploadedTasks: Task[] = [];

  allListIds: string[] = [];

  ngOnInit() {
    if (this.projectId_ && this.projectId_['key']) {
      this.projectService.getProjectById(this.projectId_['key']).subscribe(
        project => {
          this.boardType = project.boardType || 'project';
          this.projectName = project.name || '';
          this.ideas = project.ideas || '';
          this.gameDevDoc = project.gameDevDoc || '';
          if (this.gameDevDoc) {
            try {
              const parsed = JSON.parse(this.gameDevDoc);
              this.gameDevDocName = parsed.name || '';
            } catch (e) {
              this.gameDevDocName = '';
            }
          }
          this.prototypeLink = project.prototypeLink || '';
          this.liveLink = project.liveLink || '';
          this.updateListIds();
          this.loadTasks();
        },
        error => {
          console.error('Error fetching project, defaulting to project board', error);
          this.updateListIds();
          this.loadTasks();
        }
      );
    } else {
      this.updateListIds();
      this.loadTasks();
    }
  }

  updateListIds() {
    if (this.boardType === 'content') {
      this.allListIds = ['videoTasks', 'uploadedTasks'];
    } else if (this.boardType === 'gamedev') {
      this.allListIds = ['readyToWorkTasks', 'inProgressTasks', 'blockedTasks', 'inReviewTasks', 'doneTasks', 'backlogTasks'];
    } else {
      this.allListIds = ['readyToWorkTasks', 'inProgressTasks', 'blockedTasks', 'inReviewTasks', 'doneTasks', 'backlogTasks'];
    }
  }

  loadTasks() {
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
    if (this.boardType === 'content') {
      this.videoTasks = this.tasks.filter(task => task.state === 'video');
      this.uploadedTasks = this.tasks.filter(task => task.state === 'uploaded');
    } else if (this.boardType === 'gamedev') {
      this.backlogTasks = this.tasks.filter(task => task.state === 'backlog');
      this.inProgressTasks = this.tasks.filter(task => task.state === 'in progress');
      this.readyToWorkTasks = this.tasks.filter(task => task.state === 'ready to work');
      this.blockedTasks = this.tasks.filter(task => task.state === 'blocked');
      this.inReviewTasks = this.tasks.filter(task => task.state === 'in review');
      this.doneTasks = this.tasks.filter(task => task.state === 'done');
    } else {
      this.backlogTasks = this.tasks.filter(task => task.state === 'backlog');
      this.inProgressTasks = this.tasks.filter(task => task.state === 'in progress');
      this.readyToWorkTasks = this.tasks.filter(task => task.state === 'ready to work');
      this.blockedTasks = this.tasks.filter(task => task.state === 'blocked');
      this.inReviewTasks = this.tasks.filter(task => task.state === 'in review');
      this.doneTasks = this.tasks.filter(task => task.state === 'done');
    }
  }

  back() {
    //window.alert('The project board has been Opened!');
    this.router.navigate(['']);
  }

  addTask(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '350px',
      data: { projectId: this.projectId_['key'], boardType: this.boardType }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.refresh) {
        this.loadTasks();
      }
    });
  }

  importTasks(): void {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '500px',
      data: { projectId: this.projectId_['key'] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.refresh) {
        this.loadTasks();
      }
    });
  }

  onIncreaseTaskPriority(task: any): void {
    const newPriority = Math.min(5, (task.priority || 0) + 1);
    this.projectService.updateTaskPriority(task.id, newPriority).subscribe(
      () => this.loadTasks(),
      error => console.error('Error updating task priority', error)
    );
  }

  onDecreaseTaskPriority(task: any): void {
    const newPriority = Math.max(0, (task.priority || 0) - 1);
    this.projectService.updateTaskPriority(task.id, newPriority).subscribe(
      () => this.loadTasks(),
      error => console.error('Error updating task priority', error)
    );
  }

  onDeleteTask(task: any): void {
    this.projectService.deleteTask(task.id).subscribe(
      () => this.loadTasks(),
      error => console.error('Error deleting task', error)
    );
  }

  onIdeasChange(): void {
    if (this.ideasTimer) {
      clearTimeout(this.ideasTimer);
    }
    this.ideasTimer = setTimeout(() => {
      if (this.projectId_ && this.projectId_['key']) {
        this.projectService.updateIdeas(this.projectId_['key'], this.ideas).subscribe(
          () => {},
          error => console.error('Error saving ideas', error)
        );
      }
    }, 800);
  }

  onGameDevDocUpload(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    this.gameDevDocName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result as string;
      this.gameDevDoc = JSON.stringify({ name: file.name, data: fileData });
      if (this.projectId_ && this.projectId_['key']) {
        this.projectService.updateGameDevDoc(this.projectId_['key'], this.gameDevDoc).subscribe(
          () => {},
          error => console.error('Error saving game dev doc', error)
        );
      }
    };
    reader.readAsDataURL(file);
  }

  onGameDevDocRemove(): void {
    this.gameDevDoc = '';
    this.gameDevDocName = '';
    if (this.projectId_ && this.projectId_['key']) {
      this.projectService.deleteGameDevDoc(this.projectId_['key']).subscribe(
        () => {},
        error => console.error('Error removing game dev doc', error)
      );
    }
  }

  onPrototypeLinkChange(): void {
    if (this.prototypeLinkTimer) {
      clearTimeout(this.prototypeLinkTimer);
    }
    this.prototypeLinkTimer = setTimeout(() => {
      if (this.projectId_ && this.projectId_['key']) {
        this.projectService.updatePrototypeLink(this.projectId_['key'], this.prototypeLink).subscribe(
          () => {},
          error => console.error('Error saving prototype link', error)
        );
      }
    }, 800);
  }

  onLiveLinkChange(): void {
    if (this.liveLinkTimer) {
      clearTimeout(this.liveLinkTimer);
    }
    this.liveLinkTimer = setTimeout(() => {
      if (this.projectId_ && this.projectId_['key']) {
        this.projectService.updateLiveLink(this.projectId_['key'], this.liveLink).subscribe(
          () => {},
          error => console.error('Error saving live link', error)
        );
      }
    }, 800);
  }

  drop(event: CdkDragDrop<Task[]>): void {
    const previousContainerId = event.previousContainer.id;
    const currentContainerId = event.container.id;
  
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
  
      const task = event.container.data[event.currentIndex];
      const newState = this.getStateFromContainerId(currentContainerId);
  
      this.projectService.updateTaskState(task.id, newState).subscribe({
        next: (response) => console.log('Task state updated', response),
        error: (err) => console.error('Error updating task state', err)
      });
  
      task.state = newState;
    }
  }

  private getStateFromContainerId(containerId: string): string {
    const stateMap: { [key: string]: string } = {
      'backlogTasks': 'backlog',
      'inProgressTasks': 'in progress',
      'readyToWorkTasks': 'ready to work',
      'blockedTasks': 'blocked',
      'inReviewTasks': 'in review',
      'doneTasks': 'done',
      'videoTasks': 'video',
      'uploadedTasks': 'uploaded'
    };
    return stateMap[containerId] || 'unknown';
  }

}
