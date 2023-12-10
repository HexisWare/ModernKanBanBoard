import { Component, Input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-list-card',
  templateUrl: './project-list-card.component.html',
  styleUrls: ['./project-list-card.component.css']
})
export class ProjectListCardComponent {
  @Input() project: any;

  constructor(private router: Router) {}

  openBoard() {
    //window.alert('The project board has been Opened!');
    const dataToPass = { key: this.project.id };
    this.router.navigate(['/tasking-board'], { state: { id: dataToPass }});
  }
}
