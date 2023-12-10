import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-task-list-card',
  templateUrl: './task-list-card.component.html',
  styleUrls: ['./task-list-card.component.css']
})
export class TaskListCardComponent {
  @Input() task: any;

}
