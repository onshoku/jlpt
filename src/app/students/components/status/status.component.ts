import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/core/api.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent {
  currentTerm = 'December 2025 Examination';
  registrationSteps = [
    {
      id: 'personal',
      name: 'Personal Information',
      icon: '👤',
      action: 'Complete Info',
    },
    {
      id: 'documents',
      name: 'Document Upload',
      icon: '📄',
      action: 'Upload Documents',
    },
    {
      id: 'undertaking',
      name: 'Undertaking',
      icon: '🤝',
      action: 'Accept Undertaking',
    },
    { id: 'payment', name: 'Payment', icon: '💴', action: 'Make Payment' },
    {
      id: 'confirmation',
      name: 'Confirmation',
      icon: '✅',
      action: 'View Confirmation',
    },
  ];

  @Output() startNewRegistartion = new EventEmitter<any>();

  isLoading = true;

  registrations: any = [
    // {
    //   id: 'JLPT-2023-N3-8542',
    //   level: 'N3',
    //   examDate: new Date('2023-12-03'),
    //   testCenter: 'Pune International Test Center',
    //   status: 'In Progress',
    //   progress: 50,
    //   paymentAmount: 5500,
    //   paymentDate: null,
    //   documentSubmissionDate: new Date('2023-10-15'),
    //   lastUpdated: new Date('2023-10-16'),
    //   seatNumber: null,
    //   completedSteps: ['personal', 'documents'],
    // },
    // {
    //   id: 'JLPT-2023-N2-7216',
    //   level: 'N2',
    //   examDate: new Date('2023-12-03'),
    //   testCenter: 'Mumbai International Test Center',
    //   status: 'Payment Pending',
    //   progress: 75,
    //   paymentAmount: 6500,
    //   paymentDate: null,
    //   documentSubmissionDate: new Date('2023-10-18'),
    //   lastUpdated: new Date('2023-10-18'),
    //   seatNumber: null,
    //   completedSteps: ['personal', 'documents', 'payment'],
    // },
    // {
    //   id: 'JLPT-2023-N4-3291',
    //   level: 'N4',
    //   examDate: new Date('2023-12-03'),
    //   testCenter: 'Delhi International Test Center',
    //   status: 'Completed',
    //   progress: 100,
    //   paymentAmount: 4500,
    //   paymentDate: new Date('2023-09-28'),
    //   documentSubmissionDate: new Date('2023-09-25'),
    //   lastUpdated: new Date('2023-09-30'),
    //   seatNumber: 'N4-D-142',
    //   completedSteps: ['personal', 'documents', 'payment', 'confirmation'],
    // },
  ];

  constructor(private router: Router, private backendService: BackendService) {}

  ngOnInit(): void {
    // In a real app, you would fetch this data from a service
    let projection = {
      id: 1,
      testLevel: 1,
      examDate: 1,
      testCenter: 1,
      progress: 1,
      paymentAmount: 1,
      paymentDate: 1,
      documentSubmissionDate: 1,
      updatedAt: 1,
      seatNumber: 1,
      // completedSteps: ['personal', 'documents']
    };
    this.backendService.getFormsByUserId(projection).subscribe({
      next: (res) => {
        console.log(res);
        // this.registrations = res.data.map((data: any) => ({
        //   level: 'N' + data.testLevel,
        //   progress: data.progress || 0,
        //   date: this.formatToDDMMYYYY(data.createdAt || ''),
        // }));
        res.data.forEach((form: any) => {
          let obj: any = {};
          obj['id'] = form['id'];
          obj['level'] = 'N' + form['testLevel'];

          obj['examDate'] = form['examDate'] || new Date();
          obj['testCenter'] = form['examDate'] || 'Pune Test Center';
          obj['status'] = this.calculateStatus(form['progress'] || 0);
          obj['progress'] = form['progress'] || 0;
          obj['paymentAmount'] = form['paymentAmount'] || 0;
          obj['paymentDate'] = form['paymentDate'] || new Date();
          obj['documentSubmissionDate'] =
            form['documentSubmissionDate'] || new Date();
          obj['lastUpdated'] = form['updatedAt'] || new Date();
          obj['seatNumber'] = form['seatNumber'] || null;
          obj['completedSteps'] = this.calculateSteps(form['progress'] || 0);

          this.registrations.push(obj);
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  calculateSteps(progress: number) {
    let steps:any = [];
    if(progress >= 20 && progress < 40){
      steps = ['personal']
    }else if(progress >= 40 && progress < 60){
      steps = ['personal','documents']
    }else if (progress >= 60 && progress < 80) {
      steps = ['personal','documents','undertaking']
    }else if (progress >= 80 && progress < 100) {
      steps = ['personal','documents','undertaking','payment']
    } else if (progress >= 100) {
      steps = ['personal','documents','undertaking','payment','confirmation']
    }
    return steps;
  }

  calculateStatus(progress: number) {
    if (progress < 20) {
      return 'Form Filling';
    } else if (progress >= 20 && progress < 40) {
      return 'Document Upload Pending';
    } else if (progress >= 40 && progress < 60) {
      return 'Accept Undertaking';
    } else if (progress >= 60 && progress < 80) {
      return 'Payment Pending';
    }  else if (progress >= 80 && progress < 100) {
      return 'Review Pending';
    } else if (progress >= 100) {
      return 'Completed';
    }else {
      return 'In Progress';
    }
    
  }
  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }

  isStepCompleted(registration: any, stepId: string): boolean {
    return registration.completedSteps.includes(stepId);
  }

  isCurrentStep(registration: any, stepId: string): boolean {
    if (this.isStepCompleted(registration, stepId)) return false;

    // Find the first incomplete step
    const currentStep = this.registrationSteps.find(
      (step) => !registration.completedSteps.includes(step.id)
    );

    return currentStep?.id === stepId;
  }

  navigateToStep(registration: any, stepId: string): void {
    // In a real app, this would navigate to the specific step in the form
    console.log(`Navigating to ${stepId} for registration ${registration.id}`);
    // this.router.navigate(['/registration', registration.level], {
    //   queryParams: { step: stepId },
    // });
    this.startNewRegistartion.emit({value:true,id:registration.id});
  }

  viewFullForm(registration: any): void {
    console.log(`Viewing full form for ${registration.id}`);
    this.startNewRegistartion.emit({value:true,id:registration.id});
    // Navigate to view mode of the form
  }

  downloadReceipt(registration: any): void {
    console.log(`Downloading receipt for ${registration.id}`);
    // Implement receipt download functionality
  }

  emitRegistrationEvent() {
    this.startNewRegistartion.emit({value:true,id:null});
  }
}
