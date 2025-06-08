import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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

  constructor(private fb: FormBuilder) {
    this.profileForm = this.createForm();
  }

  ngOnInit(): void {
    this.filteredLanguages = this.profileForm.get('nativeLanguage')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLanguages(value))
    );

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
      nativeLanguage: ['', Validators.required],
      addressLine1: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required]
    });
  }

  private _filterLanguages(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.languages.filter(language => 
      language.toLowerCase().includes(filterValue));
  }

  loadProfileData(): void {
    // In a real app, you would get this from a service
    const profileData = {
      firstName: 'Akira',
      middleName: '',
      lastName: 'Tanaka',
      gender: 'male',
      dob: new Date(1990, 5, 15),
      nativeLanguage: 'Japanese',
      addressLine1: '123 Sakura Street',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '411057'
    };

    this.profileForm.patchValue(profileData);
    this.profilePhoto = 'assets/sample-profile.jpg';
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
    if (this.profileForm.valid) {
      console.log('Profile updated:', this.profileForm.value);
      // In a real app, you would call a service to save the data
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
