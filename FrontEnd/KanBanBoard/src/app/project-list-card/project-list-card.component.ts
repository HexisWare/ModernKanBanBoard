import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../projects';

@Component({
  selector: 'app-project-list-card',
  templateUrl: './project-list-card.component.html',
  styleUrls: ['./project-list-card.component.css']
})
export class ProjectListCardComponent {
  @Input() project!: Project;
  @Input() index: number = 0;
  @Input() total: number = 0;

  @Output() moveUp = new EventEmitter<number>();
  @Output() moveDown = new EventEmitter<number>();
  @Output() increasePriority = new EventEmitter<Project>();
  @Output() decreasePriority = new EventEmitter<Project>();

  constructor(private router: Router) {}

  openBoard() {
    const dataToPass = { key: this.project.id };
    this.router.navigate(['/tasking-board'], { state: { id: dataToPass }});
  }

  onMoveUp() {
    this.moveUp.emit(this.index);
  }

  onMoveDown() {
    this.moveDown.emit(this.index);
  }

  onIncreasePriority() {
    this.increasePriority.emit(this.project);
  }

  onDecreasePriority() {
    this.decreasePriority.emit(this.project);
  }

  getPriorityLabel(): string {
    const p = this.project.priority || 0;
    const labels = ['None', 'Lowest', 'Low', 'Medium', 'High', 'Highest'];
    return labels[p] || 'None';
  }

  getPriorityClass(): string {
    const p = this.project.priority || 0;
    const classes = ['priority-none', 'priority-lowest', 'priority-low', 'priority-medium', 'priority-high', 'priority-highest'];
    return classes[p] || 'priority-none';
  }

  getPriorityIcon(): string {
    const p = this.project.priority || 0;
    const icons = ['remove', 'arrow_downward', 'arrow_downward', 'drag_handle', 'arrow_upward', 'arrow_upward'];
    return icons[p] || 'remove';
  }
}
