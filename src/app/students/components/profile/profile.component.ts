import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BackendService } from 'src/app/core/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
profileForm: FormGroup;
  profilePhoto: string | null = null;
  filteredLanguages!: Observable<string[]>;
  
  languages = [
    'English', 'Japanese', 'Chinese', 'Korean', 'Spanish', 'French', 'German',
    'Hindi', 'Arabic', 'Portuguese', 'Russian', 'Italian', 'Dutch', 'Swedish',
    // ... (complete list of languages would go here)
  ];

  constructor(private fb: FormBuilder,private backendService: BackendService) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    // this.filteredLanguages = this.profileForm.get('nativeLanguage')!.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterLanguages(value))
    // );

    // Load profile data in a real app
    this.loadProfileData();
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      country: ['', Validators.required],
      pincode: ['', Validators.required]
    });
  }

  private _filterLanguages(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.languages.filter(language => 
      language.toLowerCase().includes(filterValue));
  }

   splitFullName(fullName: string): any {
  if (!fullName || typeof fullName !== 'string') {
    return { firstName: '', middleName: null, lastName: null };
  }

  // Trim and clean up multiple spaces
  const cleanedName = fullName.trim().replace(/\s+/g, ' ');
  const nameParts = cleanedName.split(' ');

  // Handle empty string
  if (nameParts.length === 0) {
    return { firstName: '', middleName: null, lastName: null };
  }

  // Single name (only first name provided)
  if (nameParts.length === 1) {
    return {
      firstName: nameParts[0],
      middleName: null,
      lastName: null
    };
  }

  // Two names (first + last, no middle)
  if (nameParts.length === 2) {
    return {
      firstName: nameParts[0],
      middleName: null,
      lastName: nameParts[1]
    };
  }

  // Three or more names (first + middle + last)
  return {
    firstName: nameParts[0],
    middleName: nameParts.slice(1, -1).join(' ') || null, // Handle multiple middle names
    lastName: nameParts[nameParts.length - 1] || null
  };
}

  loadProfileData(): void {
    // In a real app, you would get this from a service
    let userId = localStorage.getItem('userId') || ''
    this.backendService.getUserById(userId).subscribe({
        next: (res) => {
          let name = this.splitFullName(res.data.fullName);
          let profileData = {
            firstName: name.firstName,
            middleName: name.middleName,
            lastName: name.lastName,
            gender: res.data.gender,
            dob: res.data.dob,
            address1: res.data.address1,
            address2:res.data.address2,
            country: res.data.country,
            pincode: res.data.pincode
          }
           this.profileForm.patchValue(profileData);
        },
        error: (err) => {
          // this.isLoading = false;
        },
      });
    // const profileData = {
    //   firstName: 'Akira',
    //   middleName: '',
    //   lastName: 'Tanaka',
    //   gender: 'male',
    //   dob: new Date(1990, 5, 15),
    //   // nativeLanguage: 'Japanese',
    //   address1: '123 Sakura Street',
    //   address2: 'Pune',
    //   country: 'India',
    //   pincode: '411057'
    // };

   
    // this.profilePhoto = 'assets/sample-profile.jpg';
  }

  onPhotoSelect(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match('image.*')) {
      alert('Only image files are allowed');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
      alert('File size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profilePhoto = e.target.result;
      // In a real app, you would upload this to your backend
    };
    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.profilePhoto = null;
  }

  onSubmit(): void {
    console.log("submittes",this.profileForm.value);
    
    if (this.profileForm.valid) {
      console.log('Profile updated:', this.profileForm.value);
      // In a real app, you would call a service to save the data
      let changedValues = {
        userId: localStorage.getItem('userId'),
        ...this.profileForm.value
      }
      this.backendService.saveUser(changedValues).subscribe(
        (result) => {
          
          console.log('result', result);

        },
        (error: any) => {
          //console.log('!! error from updateAPI', error);
        }
      );
      this.profileForm.markAsPristine();
    }
  }

  resetForm(): void {
    if (confirm('Are you sure you want to discard your changes?')) {
      this.loadProfileData();
      this.profileForm.markAsPristine();
    }
  }
}
