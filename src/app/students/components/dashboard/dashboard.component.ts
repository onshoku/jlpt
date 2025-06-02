import { Component } from '@angular/core';
import { BackendService } from 'src/app/core/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  userName = 'Akira'; // Would come from auth service
  currentExams = [
    { level: 'N3', date: new Date('2023-12-03'), progress: 65 },
    { level: 'N2', date: new Date('2023-12-03'), progress: 30 }
  ];

  upcomingExams = [
    { level: 'N3', date: new Date('2023-12-03'), location: 'Pune Test Center' },
    { level: 'N2', date: new Date('2024-07-07'), location: 'Mumbai Test Center' }
  ];

  jlptLevels = [
    { level: 'N1', remainingSeats: 12 },
    { level: 'N2', remainingSeats: 45 },
    { level: 'N3', remainingSeats: 0 },
    { level: 'N4', remainingSeats: 82 },
    { level: 'N5', remainingSeats: 18 }
  ];
  lastUpdated = new Date();

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    // You would typically fetch this data from a service
    this.lastUpdated = new Date();

    this.backendService.getData({}).subscribe({
      next: (res) => {
        console.log(res);
        this.jlptLevels = [
    { level: 'N1', remainingSeats: res.n1 || 0 },
    { level: 'N2', remainingSeats: res.n2 || 0 },
    { level: 'N3', remainingSeats: res.n3 || 0 },
    { level: 'N4', remainingSeats: res.n4 || 0 },
    { level: 'N5', remainingSeats: res.n5 || 0 }
  ];

  this.upcomingExams = [
    { level: '', date: new Date(res.examDate), location: 'Pune Test Center' },
    
  ];
      },
      error: (err) => {
        
      }
    });
  }
}
