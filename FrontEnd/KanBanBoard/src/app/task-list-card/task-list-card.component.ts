import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProjectService } from '../project.service';
import { Comment } from '../tasks';

@Component({
  selector: 'app-task-list-card',
  templateUrl: './task-list-card.component.html',
  styleUrls: ['./task-list-card.component.css']
})
export class TaskListCardComponent {
  @Input() task: any;
  @Output() increasePriority = new EventEmitter<any>();
  @Output() decreasePriority = new EventEmitter<any>();
  @Output() deleteTask = new EventEmitter<any>();

  expanded = false;
  comments: Comment[] = [];
  newCommentText = '';
  loadingComments = false;

  constructor(private projectService: ProjectService) {}

  getStateClass(): string {
    const state = (this.task.state || '').toLowerCase().replace(/\s+/g, '-');
    return 'state-' + state;
  }

  getStateLabel(): string {
    return this.task.state || '';
  }

  getPriorityLabel(): string {
    const p = this.task.priority || 0;
    const labels = ['None', 'Lowest', 'Low', 'Medium', 'High', 'Highest'];
    return labels[p] || 'None';
  }

  getPriorityClass(): string {
    const p = this.task.priority || 0;
    const classes = ['priority-none', 'priority-lowest', 'priority-low', 'priority-medium', 'priority-high', 'priority-highest'];
    return classes[p] || 'priority-none';
  }

  getPriorityIcon(): string {
    const p = this.task.priority || 0;
    const icons = ['remove', 'arrow_downward', 'arrow_downward', 'drag_handle', 'arrow_upward', 'arrow_upward'];
    return icons[p] || 'remove';
  }

  onIncreasePriority() {
    this.increasePriority.emit(this.task);
  }

  onDecreasePriority() {
    this.decreasePriority.emit(this.task);
  }

  onDeleteTask(event: Event) {
    event.stopPropagation();
    this.deleteTask.emit(this.task);
  }

  toggleExpand() {
    this.expanded = !this.expanded;
    if (this.expanded && this.comments.length === 0 && !this.loadingComments) {
      this.loadComments();
    }
  }

  loadComments() {
    this.loadingComments = true;
    this.projectService.getComments(this.task.id).subscribe(
      data => {
        this.comments = data;
        this.loadingComments = false;
      },
      error => {
        console.error('Error loading comments', error);
        this.loadingComments = false;
      }
    );
  }

  addComment() {
    if (!this.newCommentText.trim()) return;
    this.projectService.addComment(this.task.id, this.newCommentText).subscribe(
      () => {
        this.newCommentText = '';
        this.loadComments();
      },
      error => console.error('Error adding comment', error)
    );
  }

  removeComment(commentId: number, event: Event) {
    event.stopPropagation();
    this.projectService.deleteComment(commentId).subscribe(
      () => this.loadComments(),
      error => console.error('Error deleting comment', error)
    );
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
