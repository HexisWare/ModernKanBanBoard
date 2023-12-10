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
}
