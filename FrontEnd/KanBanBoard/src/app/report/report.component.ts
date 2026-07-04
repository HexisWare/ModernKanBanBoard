import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {
  selectedYear: number = new Date().getFullYear();
  reportData: any[] = [];
  loading: boolean = false;

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit() {
    this.loadReport();
  }

  loadReport() {
    this.loading = true;
    this.projectService.getReport(this.selectedYear).subscribe(
      data => {
        this.reportData = data;
        this.loading = false;
      },
      error => {
        console.error('Error loading report', error);
        this.reportData = [];
        this.loading = false;
      }
    );
  }

  onYearChange() {
    this.loadReport();
  }

  getQuarter(dateStr: string): number {
    if (!dateStr) return 0;
    const month = parseInt(dateStr.substring(5, 7));
    return Math.ceil(month / 3);
  }

  getTasksForQuarter(project: any, quarter: number): any[] {
    return project.tasks.filter((t: any) => this.getQuarter(t.doneDate) === quarter);
  }

  prevYear() {
    this.selectedYear--;
    this.loadReport();
  }

  nextYear() {
    this.selectedYear++;
    this.loadReport();
  }

  getPriorityLabel(priority: number): string {
    const labels = ['None', 'Lowest', 'Low', 'Medium', 'High', 'Highest'];
    return labels[priority] || 'None';
  }

  getPriorityClass(priority: number): string {
    const classes = ['priority-none', 'priority-lowest', 'priority-low', 'priority-medium', 'priority-high', 'priority-highest'];
    return classes[priority] || 'priority-none';
  }

  navigateToBoard(projectId: number) {
    this.router.navigate(['/tasking-board'], { state: { id: { key: projectId } } });
  }
}
