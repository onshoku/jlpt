import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent {
  currentTerm = 'December 2023 Examination';
  registrationSteps = [
    { id: 'personal', name: 'Personal Information', icon: '👤', action: 'Complete Info' },
    { id: 'documents', name: 'Document Upload', icon: '📄', action: 'Upload Documents' },
    { id: 'payment', name: 'Payment', icon: '💴', action: 'Make Payment' },
    { id: 'confirmation', name: 'Confirmation', icon: '✅', action: 'View Confirmation' }
  ];

  registrations = [
    {
      id: 'JLPT-2023-N3-8542',
      level: 'N3',
      examDate: new Date('2023-12-03'),
      testCenter: 'Pune International Test Center',
      status: 'In Progress',
      progress: 50,
      paymentAmount: 5500,
      paymentDate: null,
      documentSubmissionDate: new Date('2023-10-15'),
      lastUpdated: new Date('2023-10-16'),
      seatNumber: null,
      completedSteps: ['personal', 'documents']
    },
    {
      id: 'JLPT-2023-N2-7216',
      level: 'N2',
      examDate: new Date('2023-12-03'),
      testCenter: 'Mumbai International Test Center',
      status: 'Payment Pending',
      progress: 75,
      paymentAmount: 6500,
      paymentDate: null,
      documentSubmissionDate: new Date('2023-10-18'),
      lastUpdated: new Date('2023-10-18'),
      seatNumber: null,
      completedSteps: ['personal', 'documents', 'payment']
    },
    {
      id: 'JLPT-2023-N4-3291',
      level: 'N4',
      examDate: new Date('2023-12-03'),
      testCenter: 'Delhi International Test Center',
      status: 'Completed',
      progress: 100,
      paymentAmount: 4500,
      paymentDate: new Date('2023-09-28'),
      documentSubmissionDate: new Date('2023-09-25'),
      lastUpdated: new Date('2023-09-30'),
      seatNumber: 'N4-D-142',
      completedSteps: ['personal', 'documents', 'payment', 'confirmation']
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // In a real app, you would fetch this data from a service
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
    const currentStep = this.registrationSteps.find(step => 
      !registration.completedSteps.includes(step.id)
    );
    
    return currentStep?.id === stepId;
  }

  navigateToStep(registration: any, stepId: string): void {
    // In a real app, this would navigate to the specific step in the form
    console.log(`Navigating to ${stepId} for registration ${registration.id}`);
    this.router.navigate(['/registration', registration.level], {
      queryParams: { step: stepId }
    });
  }

  viewFullForm(registration: any): void {
    console.log(`Viewing full form for ${registration.id}`);
    // Navigate to view mode of the form
  }

  downloadReceipt(registration: any): void {
    console.log(`Downloading receipt for ${registration.id}`);
    // Implement receipt download functionality
  }
}
