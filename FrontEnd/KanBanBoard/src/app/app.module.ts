import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectListCardComponent } from './project-list-card/project-list-card.component';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule} from '@angular/material/dialog';
import { AddProjectDialogComponent } from './add-project-dialog/add-project-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskingBoardComponent } from './tasking-board/tasking-board.component';
import { AppRoutingModule } from './app-routing.module';
import { TaskListCardComponent } from './task-list-card/task-list-card.component';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  imports: [
    BrowserModule,
    MatCardModule,
    MatIconModule,
    HttpClientModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    AppRoutingModule,
    DragDropModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: ProjectListComponent },
    ])
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    ProjectListComponent,
    ProjectListCardComponent,
    AddProjectDialogComponent,
    TaskingBoardComponent,
    TaskListCardComponent,
    AddTaskDialogComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
