import { Component } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition,
  state,
} from '@angular/animations';
import { ReportService } from 'src/app/core/report.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class ReportsComponent {
  hovered: any = '';
  reports = [
    { id: 'levelWise', title: 'Level Wise Application Forms', icon: '📄' },
    { id: 'gst', title: 'GST Sheet', icon: '🧾' },
    { id: 'payment', title: 'Payment Sheet', icon: '💳' },
    { id: 'carryForward', title: 'Carry Forward Applicants', icon: '🔁' },
    { id: 'upgraded', title: 'Upgraded Applicants', icon: '🚀' },
    { id: 'refund', title: 'Refund Sheet', icon: '💰' },
    { id: 'test', title: 'JALTAP Data Testing', icon: '🧪' },
  ];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  downloadingID = '';
  constructor(private reportService: ReportService) {}

  downloadReport(type: string) {
    // Call your backend/export logic here
    console.log(`Downloading report: ${type}`);
    if (type == 'test') {
      const payload = {
        timeOfExam: '25B',
      };
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.downloadingID = type;
      this.reportService.exportMatchingRecords(payload).subscribe({
        next: (blob) => {
          this.isLoading = false;

          if (blob.size === 0) {
            this.errorMessage = 'No data found for the selected criteria.';
            return;
          }

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'form-submissions.csv';
          a.click();
          window.URL.revokeObjectURL(url);

          this.successMessage = 'Download started successfully.';
          setTimeout(() => {
            this.errorMessage = '';
            this.successMessage = '';
          }, 4000); // Clears messages after 4 seconds
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.status === 404) {
            this.errorMessage = 'No matching records found.';
          } else {
            this.errorMessage =
              'Something went wrong while exporting. Please try again later.';
          }
          setTimeout(() => {
            this.errorMessage = '';
            this.successMessage = '';
          }, 4000); // Clears messages after 4 seconds
          console.error('Download error:', err);
        },
      });
    }else if (type == 'levelWise') {
      const payload = {
        timeOfExam: '25B',
      };
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      this.downloadingID = type;
      this.reportService.exportLevelRecords(payload).subscribe({
        next: (blob) => {
          this.isLoading = false;

          if (blob.size === 0) {
            this.errorMessage = 'No data found for the selected criteria.';
            return;
          }

          const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'level-wise-records.xlsx';
      a.click();
          window.URL.revokeObjectURL(url);

          this.successMessage = 'Download started successfully.';
          setTimeout(() => {
            this.errorMessage = '';
            this.successMessage = '';
          }, 4000); // Clears messages after 4 seconds
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.status === 404) {
            this.errorMessage = 'No matching records found.';
          } else {
            this.errorMessage =
              'Something went wrong while exporting. Please try again later.';
          }
          setTimeout(() => {
            this.errorMessage = '';
            this.successMessage = '';
          }, 4000); // Clears messages after 4 seconds
          console.error('Download error:', err);
        },
      });
    }
  }
}
