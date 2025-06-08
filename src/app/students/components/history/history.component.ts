import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/core/api.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent {
  previousTerms = ['25B', '25A', '24B', '24A', '23B'];
  examTerms: any = [
    // {
    //   id: '2023-dec',
    //   name: 'December 2023',
    //   period: 'Dec 3, 2023',
    //   exams: [
    //     {
    //       level: 'N3',
    //       date: new Date('2023-12-03'),
    //       testCenter: 'Pune International Test Center',
    //       registrationId: 'JLPT-2023-N3-8542',
    //       seatNumber: 'N3-P-142',
    //       status: 'Appeared',
    //       result: 'passed',
    //       score: 125,
    //       resultAvailable: true,
    //       resultLink: '#',
    //       resultMessage: 'Congratulations! You passed the N3 examination.',
    //       canRetake: false
    //     },
    //     {
    //       level: 'N2',
    //       date: new Date('2023-12-03'),
    //       testCenter: 'Mumbai International Test Center',
    //       registrationId: 'JLPT-2023-N2-7216',
    //       seatNumber: 'N2-M-087',
    //       status: 'Appeared',
    //       result: 'failed',
    //       score: 89,
    //       resultAvailable: true,
    //       resultLink: '#',
    //       resultMessage: 'You did not meet the passing criteria for N2.',
    //       canRetake: true
    //     }
    //   ]
    // },
    // {
    //   id: '2023-jul',
    //   name: 'July 2023',
    //   period: 'Jul 2, 2023',
    //   exams: [
    //     // {
    //     //   level: 'N4',
    //     //   date: new Date('2023-07-02'),
    //     //   testCenter: 'Delhi International Test Center',
    //     //   registrationId: 'JLPT-2023-N4-3291',
    //     //   seatNumber: 'N4-D-056',
    //     //   status: 'Appeared',
    //     //   result: 'passed',
    //     //   score: 142,
    //     //   resultAvailable: true,
    //     //   resultLink: '#',
    //     //   resultMessage: 'Congratulations! You passed the N4 examination.',
    //     //   canRetake: false
    //     // }
    //   ]
    // },
    // {
    //   id: '2022-dec',
    //   name: 'December 2022',
    //   period: 'Dec 4, 2022',
    //   exams: [
    //     // {
    //     //   level: 'N5',
    //     //   date: new Date('2022-12-04'),
    //     //   testCenter: 'Bangalore International Test Center',
    //     //   registrationId: 'JLPT-2022-N5-1124',
    //     //   seatNumber: 'N5-B-123',
    //     //   status: 'Absent',
    //     //   result: 'absent',
    //     //   score: null,
    //     //   resultAvailable: false,
    //     //   resultLink: null,
    //     //   resultMessage: 'You were marked absent for this examination.',
    //     //   canRetake: true
    //     // }
    //   ]
    // }
  ];

  selectedTermId: any = null;
  selectedTerm: any = null;
  isLoading = true;
  constructor(private router: Router, private backendService: BackendService) {}

  ngOnInit(): void {
    // In a real app, you would fetch this data from a service
    this.convertTermsToDate();
  }

  convertTermsToDate() {
    for (let term of this.previousTerms) {
      let year = '20' + term.slice(0, 2);
      let batch = term.slice(2, 3);
      let name = '';
      console.log(batch, term);

      if (batch == 'A') {
        name = 'July ' + year;
      } else if (batch == 'B') {
        name = 'December ' + year;
      }

      this.examTerms.push({
        name: name,
        id: term,
      });
    }

    this.selectedTermId = this.examTerms[0]?.id;
    this.selectedTerm = this.examTerms[0];

    if (!this.selectedTerm.hasOwnProperty('exams')) this.callDataAPI();
  }

  onTermChange(): void {
    this.isLoading = true;
    this.selectedTerm =
      this.examTerms.find((term: any) => term.id === this.selectedTermId) ||
      null;

    if (!this.selectedTerm.hasOwnProperty('exams')) {
      this.callDataAPI();
    } else {
      this.isLoading = false;
    }
  }

  regSiteCodes: any = {
    3010201: 'Pune Test Center',
  };
  callDataAPI() {
    let projection = {
      examResult: 1,
      id: 1,
      regSiteCode: 1,
      testLevel: 1,
      regSeq: 1,
      updatedAt: 1,
      timeOfExam: 1,
    };

    this.backendService
      .getFormsByUserId(projection, this.selectedTermId)
      .subscribe({
        next: (res) => {
          console.log(res);
          const index = this.examTerms.findIndex(
            (obj: any) => obj.id == this.selectedTermId
          );

          // level: 'N5',
          //     //   date: new Date('2022-12-04'),
          //     //   testCenter: 'Bangalore International Test Center',
          //     //   registrationId: 'JLPT-2022-N5-1124',
          //     //   seatNumber: 'N5-B-123',
          //     //   status: 'Absent',
          //     //   result: 'absent',
          //     //   score: null,
          //     //   resultAvailable: false,
          //     //   resultLink: null,
          //     //   resultMessage: 'You were marked absent for this examination.',
          //     //   canRetake: true

          console.log(index);

          if (index >= 0) {
            this.examTerms[index]['exams'] = [];
            res.data.forEach((data: any) => {
              this.examTerms[index]['exams'].push({
                level: 'N' + data.testLevel,
                testCenter:
                  this.regSiteCodes[data.regSiteCode] || 'Pune Test Center',
                registrationId: data.id,
                seatNumber: data.timeOfExam + data.regSiteCode + data.regSeq,
                result: data.examResult,
              });
            });
            this.selectedTerm = this.examTerms[index];
          }

          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getResultClass(result: string): string {
    return result || '';
  }

  getResultIcon(result: string): string {
    switch (result) {
      case 'passed':
        return '🎉';
      case 'failed':
        return '⚠️';
      case 'absent':
        return '❌';
      default:
        return '';
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
