import { Component } from '@angular/core';
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

  constructor(private projectService: ProjectService) {}

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
}
