import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskingBoardComponent } from './tasking-board/tasking-board.component';
import { ProjectListComponent } from './project-list/project-list.component';

const routes: Routes = [
  { path: 'tasking-board', component: TaskingBoardComponent },
  { path: '', component: ProjectListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
