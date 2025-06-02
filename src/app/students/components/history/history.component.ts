import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  examTerms = [
    {
      id: '2023-dec',
      name: 'December 2023',
      period: 'Dec 3, 2023',
      exams: [
        {
          level: 'N3',
          date: new Date('2023-12-03'),
          testCenter: 'Pune International Test Center',
          registrationId: 'JLPT-2023-N3-8542',
          seatNumber: 'N3-P-142',
          status: 'Appeared',
          result: 'passed',
          score: 125,
          resultAvailable: true,
          resultLink: '#',
          resultMessage: 'Congratulations! You passed the N3 examination.',
          canRetake: false
        },
        {
          level: 'N2',
          date: new Date('2023-12-03'),
          testCenter: 'Mumbai International Test Center',
          registrationId: 'JLPT-2023-N2-7216',
          seatNumber: 'N2-M-087',
          status: 'Appeared',
          result: 'failed',
          score: 89,
          resultAvailable: true,
          resultLink: '#',
          resultMessage: 'You did not meet the passing criteria for N2.',
          canRetake: true
        }
      ]
    },
    {
      id: '2023-jul',
      name: 'July 2023',
      period: 'Jul 2, 2023',
      exams: [
        {
          level: 'N4',
          date: new Date('2023-07-02'),
          testCenter: 'Delhi International Test Center',
          registrationId: 'JLPT-2023-N4-3291',
          seatNumber: 'N4-D-056',
          status: 'Appeared',
          result: 'passed',
          score: 142,
          resultAvailable: true,
          resultLink: '#',
          resultMessage: 'Congratulations! You passed the N4 examination.',
          canRetake: false
        }
      ]
    },
    {
      id: '2022-dec',
      name: 'December 2022',
      period: 'Dec 4, 2022',
      exams: [
        {
          level: 'N5',
          date: new Date('2022-12-04'),
          testCenter: 'Bangalore International Test Center',
          registrationId: 'JLPT-2022-N5-1124',
          seatNumber: 'N5-B-123',
          status: 'Absent',
          result: 'absent',
          score: null,
          resultAvailable: false,
          resultLink: null,
          resultMessage: 'You were marked absent for this examination.',
          canRetake: true
        }
      ]
    }
  ];

  selectedTermId:any = this.examTerms[0]?.id || null;
  selectedTerm:any = this.examTerms[0] || null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // In a real app, you would fetch this data from a service
  }

  onTermChange(): void {
    this.selectedTerm = this.examTerms.find(term => term.id === this.selectedTermId) || null;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getResultClass(result: string): string {
    return result || '';
  }

  getResultIcon(result: string): string {
    switch(result) {
      case 'passed': return '🎉';
      case 'failed': return '⚠️';
      case 'absent': return '❌';
      default: return '';
    }
  }

  viewDetails(exam: any): void {
    console.log('Viewing details for:', exam);
    // Navigate to detailed view
  }

  registerAgain(level: string): void {
    console.log('Registering again for:', level);
    this.router.navigate(['/registration'], { queryParams: { level } });
  }
}
