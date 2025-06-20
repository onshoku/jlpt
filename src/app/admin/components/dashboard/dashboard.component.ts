import { Component } from '@angular/core';
import {  OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
   animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('cardAnim', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class DashboardComponent {
@ViewChild('levelChart', { static: true }) levelChart!: ElementRef;
  @ViewChild('monthlyChart', { static: true }) monthlyChart!: ElementRef;

  // Statistics data
  stats = {
    totalRegistrations: 1245,
    pendingApprovals: 87,
    totalPayments: 1245000,
    examCenters: 15
  };

  // Recent registrations table data
  displayedColumns: string[] = ['name', 'level', 'date', 'status', 'action'];
  recentRegistrations = [
    { id: 1, name: 'Rahul Sharma', level: 5, date: new Date(), status: 'approved' },
    { id: 2, name: 'Priya Patel', level: 4, date: new Date(), status: 'pending' },
    { id: 3, name: 'Amit Singh', level: 3, date: new Date(), status: 'approved' },
    { id: 4, name: 'Neha Gupta', level: 2, date: new Date(), status: 'rejected' },
    { id: 5, name: 'Vikram Joshi', level: 1, date: new Date(), status: 'approved' }
  ];

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createLevelChart();
    this.createMonthlyChart();
  }

  createLevelChart(): void {
    new Chart(this.levelChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['N1', 'N2', 'N3', 'N4', 'N5'],
        datasets: [{
          data: [120, 190, 300, 210, 425],
          backgroundColor: [
            '#3498db',
            '#2ecc71',
            '#f1c40f',
            '#e74c3c',
            '#9b59b6'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  createMonthlyChart(): void {
    new Chart(this.monthlyChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Registrations',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: '#3498db',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  viewDetails(id: number): void {
    console.log('View details for student:', id);
    // Implement navigation to student details
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }


  summaryStats = [
    { label: 'Total Registrations', value: 1432 },
    { label: '25A Registrations', value: 802 },
    { label: '25B Registrations', value: 630 },
    { label: 'Payments Received', value: '₹12,54,000' },
    { label: 'Refund Requests', value: 14 },
  ];

  levelLabels = ['N1', 'N2', 'N3', 'N4', 'N5'];
  levelChartData = [{ data: [41, 120, 390, 520, 361], label: 'Registrations' }];

  paymentChartData = [
    {
      data: [1023, 410],
      backgroundColor: ['#A8C97F', '#E95295']
    }
  ];

  monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  monthlyChartData = [
    { data: [50, 100, 150, 250, 370, 400], label: 'Registrations' }
  ];

  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  };
}
