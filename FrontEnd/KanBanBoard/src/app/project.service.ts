import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Project } from './projects';
import { Task } from './tasks';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl = 'http://localhost:3000';
  private apiUrl = 'http://localhost:3000/projects';

  private refreshNeeded = new Subject<void>();
  refreshNeeded$ = this.refreshNeeded.asObservable();

  constructor(private http: HttpClient) { }

  notifyRefresh() {
    this.refreshNeeded.next();
  }

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

  bulkImportTasks(tasks: any[], projectId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/projects/${projectId}/tasks/bulk`, { tasks });
  }

  updateTaskState(taskId: number, newState: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/tasks/${taskId}/state`, { state: newState });
  }

  updateTaskPriority(taskId: number, priority: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/tasks/${taskId}/priority`, { priority });
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tasks/${taskId}`);
  }

  getComments(taskId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tasks/${taskId}/comments`);
  }

  addComment(taskId: number, text: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/tasks/${taskId}/comments`, { text });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/comments/${commentId}`);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  updatePriority(projectId: number, priority: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${projectId}/priority`, { priority });
  }

  reorderProjects(orderedIds: number[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/reorder`, { orderedIds });
  }

  getReport(year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/report/${year}`);
  }
}
