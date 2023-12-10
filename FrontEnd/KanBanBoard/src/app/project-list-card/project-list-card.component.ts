import { Component, Input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-project-list-card',
  templateUrl: './project-list-card.component.html',
  styleUrls: ['./project-list-card.component.css']
})
export class ProjectListCardComponent {
  @Input() project: any;

  openBoard() {
    window.alert('The project board has been Opened!');
  }
}
