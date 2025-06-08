import { Component } from '@angular/core';
import { BackendService } from 'src/app/core/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  userName:any = 'Akira'; // Would come from auth service
  currentExams = [
    { level: 'N3', date: new Date('2023-12-03'), progress: 65 },
    { level: 'N2', date: new Date('2023-12-03'), progress: 30 },
  ];

  upcomingExams:any = [
    { level: 'N3', date: new Date('2023-12-03'), location: 'Pune Test Center' },
    {
      level: 'N2',
      date: new Date('2024-07-07'),
      location: 'Mumbai Test Center',
    },
  ];

  jlptLevels = [
    { level: 'N1', remainingSeats: 12 },
    { level: 'N2', remainingSeats: 45 },
    { level: 'N3', remainingSeats: 0 },
    { level: 'N4', remainingSeats: 82 },
    { level: 'N5', remainingSeats: 18 },
  ];
  lastUpdated = new Date();
  isLoading = true;
  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    // You would typically fetch this data from a service
    this.lastUpdated = new Date();

    let fullName = localStorage.getItem('name') || 'Student';
    let splitName = fullName.split(' ')
    this.userName = splitName[0];

    this.backendService.getData({}).subscribe({
      next: (res) => {
        console.log(res);
        this.jlptLevels = [
          { level: 'N1', remainingSeats: res.n1 || 0 },
          { level: 'N2', remainingSeats: res.n2 || 0 },
          { level: 'N3', remainingSeats: res.n3 || 0 },
          { level: 'N4', remainingSeats: res.n4 || 0 },
          { level: 'N5', remainingSeats: res.n5 || 0 },
        ];

        this.upcomingExams = [
          {
            level: '',
            date: this.formatToDDMMYYYY(res.examDate || 0),
            location: 'Pune Test Center',
          },
        ];

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      },
    });

    this.backendService.getFormsByUserId().subscribe({
      next: (res) => {
        console.log(res);
        this.currentExams = res.data.map((data: any) => ({
          level: 'N' + data.testLevel,
          progress: data.progress || 0,
          date: this.formatToDDMMYYYY(data.createdAt || ''),
        }));
      },
      error: (err) => {},
    });
  }

  formatToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
}
