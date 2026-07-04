import { Component } from '@angular/core';

import { projects, Project } from '../projects';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent {
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
    this.projectService.refreshNeeded$.subscribe(() => this.loadProjects());
  }

  get projectBoards(): Project[] {
    return this.projects.filter(p => p.boardType !== 'content');
  }

  get contentBoards(): Project[] {
    return this.projects.filter(p => p.boardType === 'content');
  }

  loadProjects() {
    this.projectService.getProjects().subscribe(
      data => {
        if(data) {
          this.projects = data;
        }else{
          this.projects = [...projects];
        }
      },
      error => {
        console.error('There was an error connecting to backend, using placeholders!', error);
        this.projects = [...projects];
      }
    );
  }

  onProjectAdded() {
    this.loadProjects();
  }

  moveUpProject(index: number) {
    const boards = this.projectBoards;
    if (index === 0) return;
    const ids = boards.map(p => p.id!);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    this.projectService.reorderProjects(ids).subscribe(
      () => this.loadProjects(),
      error => console.error('Error reordering', error)
    );
  }

  moveDownProject(index: number) {
    const boards = this.projectBoards;
    if (index === boards.length - 1) return;
    const ids = boards.map(p => p.id!);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    this.projectService.reorderProjects(ids).subscribe(
      () => this.loadProjects(),
      error => console.error('Error reordering', error)
    );
  }

  moveUpContent(index: number) {
    const boards = this.contentBoards;
    if (index === 0) return;
    const ids = boards.map(p => p.id!);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    this.projectService.reorderProjects(ids).subscribe(
      () => this.loadProjects(),
      error => console.error('Error reordering', error)
    );
  }

  moveDownContent(index: number) {
    const boards = this.contentBoards;
    if (index === boards.length - 1) return;
    const ids = boards.map(p => p.id!);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    this.projectService.reorderProjects(ids).subscribe(
      () => this.loadProjects(),
      error => console.error('Error reordering', error)
    );
  }

  increasePriority(project: Project) {
    const newPriority = Math.min(5, (project.priority || 0) + 1);
    this.projectService.updatePriority(project.id!, newPriority).subscribe(
      () => this.loadProjects(),
      error => console.error('Error updating priority', error)
    );
  }

  decreasePriority(project: Project) {
    const newPriority = Math.max(0, (project.priority || 0) - 1);
    this.projectService.updatePriority(project.id!, newPriority).subscribe(
      () => this.loadProjects(),
      error => console.error('Error updating priority', error)
    );
  }
}

