import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from './projects'; // Adjust the import path
import { Task } from './tasks';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl = 'http://localhost:3000';
  private apiUrl = 'http://localhost:3000/projects';

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  getTasksByProjectId(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/projects/${projectId}/tasks`);
  }

  addTaskByprojectId(task: any, projectId: number): Observable<Task> {
    return this.http.post<any>(`${this.baseUrl}/projects/${projectId}/tasks`, task);
  }

  deleteTaskById(taskId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${taskId}/deletetask`);
  }

  updateTaskState(taskId: number, newState: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/tasks/${taskId}/state`, { state: newState });
  }
}
