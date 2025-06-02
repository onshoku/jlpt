import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { BackendService } from 'src/app/core/api.service';

declare var Razorpay: any;

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss'],
})
export class RegistrationFormComponent {
  currentTerm = 'December 2023 Examination';
  currentPhase = 'important-notes';
  completedPhases: string[] = [];

  phases = [
    { id: 'important-notes', name: 'Important Notes' },
    { id: 'registration-form', name: 'Registration Form' },
    { id: 'upload-documents', name: 'Documents' },
    // { id: 'undertaking', name: 'Undertaking' },
    { id: 'payment', name: 'Payment' },
    { id: 'review', name: 'Review' },
  ];

  importantNotes = [
    'Before filling up the form please read Test Guide carefully',
    'The name on your registration must exactly match your government-issued ID.',
    'You must bring your original ID and registration confirmation on exam day.',
    'This Application Portal is for PUNE Centre Only',
    'You must have a HARD COPY of your Test Voucher to appear the JLPT Exam',
  ];

  stepsToFollow = [
    'Fill all the details in the forms correctly & Submit.',
    'Keep scanned image of your passport size photograph, your signature and government approved ID proof ready for uploading.',
    'Accept the given affidavit and undertaking',
    'Decide on mode of on-line payment of fee and pay the fees',
    'You will be asked to review the application form once before confirmation.',
    'After payment confirmation, registration number will be generated. No form will be accepted without registration Number.',

    'The Test Voucher will be emailed to you or you can download you.',
  ];

  registrationForm: FormGroup;
  registrationFormId: string = '';
  filteredLanguages: Observable<any> | null = null;
  showOccupationalDetails = false;

  // Tooltips (would be moved to a separate file in production)
  specialArrangementTooltip =
    'Check this if you require special arrangements due to disabilities';
  testLevelTooltip = 'Select the JLPT level you wish to take';
  testSiteTooltip =
    'The test site is automatically assigned based on your location';
  nameTooltip = 'Enter your full name using English characters only (a-z)';
  genderTooltip = 'Select your gender identification';
  nativeLanguageTooltip = 'Select your native language from the list';
  passcodeTooltip =
    'Create an 8-digit passcode (numbers only) to access your results';
  dobTooltip = 'Enter your date of birth in YYYY/MM/DD format';
  address1Tooltip = 'Enter your street address or apartment number';
  address2Tooltip = 'Enter your city and state/province';
  countryTooltip = 'Enter your country of residence';
  pincodeTooltip = 'Enter your postal/zip code';
  mailingAddressTooltip =
    'Check if your mailing address is same as residential address';
  institutionTooltip =
    'Name of institution where you study Japanese (if applicable)';
  learningPlaceTooltip =
    'Select the type of institution where you learn Japanese';
  examReasonTooltip = 'Select the primary reason for taking the JLPT';
  occupationTooltip = 'Select your current occupation status';
  occupationalDetailsTooltip =
    'Select details about your Japanese language use at work';
  mediaContactTooltip =
    'Select all media through which you encounter Japanese language';
  communicationTooltip = 'Select with whom and how you communicate in Japanese';
  previousAttemptsTooltip = 'Indicate your previous JLPT attempts and results';
  termsTooltip = 'You must agree to the terms to complete registration';

  jlptLevels = [
    { value: 1, label: 'N1' },
    { value: 2, label: 'N2' },
    { value: 3, label: 'N3' },
    { value: 4, label: 'N4' },
    { value: 5, label: 'N5' },
  ];

  learningPlaces = [
    { value: 1, label: 'Elementary school (primary education)' },
    { value: 2, label: 'Middle school or high school (secondary education)' },
    {
      value: 3,
      label: 'Majoring in Japanese at university or graduate school',
    },
    { value: 4, label: 'Learning but not majoring in Japanese at university' },
    {
      value: 5,
      label: 'Other educational institution (e.g. language schools)',
    },
    {
      value: 6,
      label: 'Not learning at educational institutions listed above',
    },
  ];

  examReasons = [
    { value: 1, label: 'For university admission in own country' },
    { value: 2, label: 'For university admission in Japan' },
    { value: 3, label: 'For other education in own country' },
    { value: 4, label: 'For other education in Japan' },
    { value: 5, label: 'For work purposes in own country' },
    { value: 6, label: 'For work purposes in Japan' },
    { value: 7, label: 'To measure my own proficiency level' },
    { value: 8, label: 'Other reasons' },
  ];

  occupations = [
    { value: 1, label: 'Elementary school student' },
    { value: 2, label: 'Middle/High school student' },
    { value: 3, label: 'University/Graduate school student' },
    { value: 4, label: 'Other educational institution student' },
    { value: 5, label: 'Employed (company employee, public servant, etc)' },
    { value: 6, label: 'Other' },
  ];

  occupationalDetails = [
    { value: 1, label: 'Japanese-language teacher' },
    { value: 2, label: 'Public servant using Japanese' },
    { value: 3, label: 'Company employee using Japanese' },
    { value: 4, label: 'Service/tourism/hospitality employee using Japanese' },
    { value: 5, label: 'Other job using Japanese' },
    { value: 6, label: 'Do not use Japanese while working' },
  ];

  mediaContacts = [
    { value: 1, label: 'TV news programs and documentaries' },
    { value: 2, label: 'Drama (excluding animation)' },
    { value: 3, label: 'Animation' },
    { value: 4, label: 'Newspapers and magazines (excluding mangas)' },
    { value: 5, label: 'Books (excluding textbooks)' },
    { value: 6, label: 'Manga' },
    { value: 7, label: 'Articles on websites' },
    { value: 8, label: 'Other media' },
    { value: 9, label: 'Do not come into contact outside class' },
  ];

  communicationPersons = [
    { id: 'teacher', label: 'With a teacher' },
    { id: 'friends', label: 'With friends' },
    { id: 'family', label: 'With family' },
    { id: 'supervisor', label: 'With a supervisor' },
    { id: 'colleagues', label: 'With colleagues' },
    { id: 'customers', label: 'With customers' },
  ];

  languages = [
    { value: '101', label: 'Assamese' },
    { value: '102', label: 'Baluchi' },
    { value: '103', label: 'Bengali' },
    { value: '104', label: 'Bihari' },
    { value: '106', label: 'Cebuano' },
    { value: '107', label: 'Chinese' },
    { value: '143', label: 'Dhivehi' },
    { value: '144', label: 'Dzongkha' },
    { value: '408', label: 'English' },
    { value: '411', label: 'French' },
    { value: '108', label: 'Gujarati' },
    { value: '109', label: 'Hindi' },
    { value: '110', label: 'Ilocano' },
    { value: '111', label: 'Indonesian' },
    { value: '112', label: 'Japanese' },
    { value: '113', label: 'Javanese' },
    { value: '114', label: 'Kannada' },
    { value: '115', label: 'Kashmiri' },
    { value: '117', label: 'Mongolian' },
    { value: '118', label: 'Khmer' },
    { value: '119', label: 'Korean' },
    { value: '120', label: 'Kurdish' },
    { value: '121', label: 'Lao' },
    { value: '122', label: 'Malay' },
    { value: '123', label: 'Malayalam' },
    { value: '124', label: 'Marathi' },
    { value: '105', label: 'Myanmar' },
    { value: '126', label: 'Nepali' },
    { value: '127', label: 'Oriya' },
    { value: '128', label: 'Pilipino' },
    { value: '129', label: 'Punjabi' },
    { value: '130', label: 'Pushtu' },
    { value: '131', label: 'Rajasthani' },
    { value: '132', label: 'Sindhi' },
    { value: '133', label: 'Sinhalese' },
    { value: '134', label: 'Sundanese' },
    { value: '135', label: 'Tamil' },
    { value: '136', label: 'Tatar' },
    { value: '137', label: 'Telugu' },
    { value: '138', label: 'Thai' },
    { value: '139', label: 'Tibetan' },
    { value: '140', label: 'Uighur' },
    { value: '141', label: 'Urdu' },
    { value: '142', label: 'Vietnamese' },
    { value: '201', label: 'Aymara' },
    { value: '407', label: 'Dutch' },
    { value: '203', label: 'Guarani' },
    { value: '413', label: 'German' },
    { value: '424', label: 'Portuguese' },
    { value: '202', label: 'Quechua' },
    { value: '430', label: 'Spanish' },
    { value: '401', label: 'Armenian' },
    { value: '442', label: 'Bosnian' },
    { value: '446', label: 'Belarussian' },
    { value: '403', label: 'Bulgarian' },
    { value: '404', label: 'Catalan' },
    { value: '439', label: 'Croatian' },
    { value: '405', label: 'Czech' },
    { value: '406', label: 'Danish' },
    { value: '410', label: 'Finnish' },
    { value: '409', label: 'Estonian' },
    { value: '414', label: 'Greek' },
    { value: '415', label: 'Hungarian' },
    { value: '416', label: 'Icelandic' },
    { value: '434', label: 'Irish' },
    { value: '417', label: 'Italian' },
    { value: '116', label: 'Kazakh' },
    { value: '437', label: 'Kirghiz' },
    { value: '418', label: 'Latvian' },
    { value: '419', label: 'Lithuanian' },
    { value: '435', label: 'Luxembourgian' },
    { value: '420', label: 'Macedonian' },
    { value: '443', label: 'Montenegrin' },
    { value: '447', label: 'Moldovan' },
    { value: '422', label: 'Norwegian' },
    { value: '423', label: 'Polish' },
    { value: '425', label: 'Romanian' },
    { value: '426', label: 'Russian' },
    { value: '427', label: 'Serbian' },
    { value: '428', label: 'Slovak' },
    { value: '429', label: 'Slovene' },
    { value: '431', label: 'Swedish' },
    { value: '432', label: 'Turkish' },
    { value: '433', label: 'Ukrainian' },
    { value: '438', label: 'Uzbek' },
    { value: '501', label: 'Fijian' },
    { value: '502', label: 'Marshallese' },
    { value: '503', label: 'Palauan' },
    { value: '504', label: 'Pidgin' },
    { value: '505', label: 'Ponapean' },
    { value: '506', label: 'Samoan' },
    { value: '507', label: 'Tahitian' },
    { value: '508', label: 'Tongan' },
    { value: '509', label: 'Yapese' },
    { value: '601', label: 'Afrikaans' },
    { value: '602', label: 'Akan' },
    { value: '603', label: 'Amharic' },
    { value: '701', label: 'Arabic' },
    { value: '629', label: 'Ashanti' },
    { value: '604', label: 'Bambara' },
    { value: '605', label: 'Bemba' },
    { value: '606', label: 'Berber' },
    { value: '607', label: 'Chichewa' },
    { value: '608', label: 'Efik' },
    { value: '609', label: 'Ewe' },
    { value: '610', label: 'Fulani' },
    { value: '611', label: 'Ga' },
    { value: '612', label: 'Galla' },
    { value: '613', label: 'Hausa' },
    { value: '614', label: 'Ibo' },
    { value: '631', label: 'Kikongo' },
    { value: '615', label: 'Kikuyu' },
    { value: '440', label: 'Azerbaijani' },
    { value: '441', label: 'Tajik' },
    { value: '402', label: 'Basque' },
    { value: '421', label: 'Maltese' },
    { value: '412', label: 'Georgian' },
    { value: '444', label: 'Galician' },
    { value: '436', label: 'Romansh' },
    { value: '125', label: 'Manipuri' },
    { value: '445', label: 'Turkmen' },
    { value: '616', label: 'Kiswahili' },
    { value: '632', label: 'Kinyarwanda' },
    { value: '617', label: 'Lingala' },
    { value: '618', label: 'Luba-Lulua' },
    { value: '619', label: 'Malagasy' },
    { value: '620', label: 'Malinke' },
    { value: '633', label: 'Matavele' },
    { value: '621', label: 'Mende' },
    { value: '634', label: 'Sango' },
    { value: '622', label: 'Shona' },
    { value: '623', label: 'Somali' },
    { value: '635', label: 'Sotho' },
    { value: '624', label: 'Tigrinya' },
    { value: '625', label: 'Twi-Fante' },
    { value: '636', label: 'Uganda' },
    { value: '626', label: 'Wolof' },
    { value: '627', label: 'Yoruba' },
    { value: '628', label: 'Zulu' },
    { value: '702', label: 'Hebrew' },
    { value: '703', label: 'Persian' },
    { value: '000', label: 'Others' },
  ];

  constructor(private fb: FormBuilder, private backendService: BackendService) {
    this.registrationForm = this.createForm();
  }

  photoFile: File | null = null;
  photoPreview: string | null = null;
  photoError: string | null = null;

  signatureFile: File | null = null;
  signaturePreview: string | null = null;
  signatureError: string | null = null;

  idProofFile: File | null = null;
  idProofPreview: string | null = null;
  idProofError: string | null = null;

  // Photo specifications
  readonly PHOTO_SPECS = {
    maxSize: 50 * 1024, // 50KB
    allowedTypes: ['image/jpeg', 'image/jpg'],
    dimensions: { width: 3.5, height: 4.5 }, // cm
  };

  // Signature specifications
  readonly SIGNATURE_SPECS = {
    maxSize: 30 * 1024, // 30KB
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg'],
    dimensions: { width: 6, height: 3 }, // cm
  };

  // ID Proof specifications
  readonly ID_PROOF_SPECS = {
    maxSize: 500 * 1024, // 500KB
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
  };

  onPhotoSelect(event: any): void {
    const file = event.target.files[0];
    this.photoError = null;

    // Validate file type
    if (!this.PHOTO_SPECS.allowedTypes.includes(file.type)) {
      this.photoError = 'Only JPG/JPEG files are allowed';
      return;
    }

    // Validate file size
    if (file.size > this.PHOTO_SPECS.maxSize) {
      this.photoError = `File size must be less than ${
        this.PHOTO_SPECS.maxSize / 1024
      }KB`;
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        // Here you could validate dimensions if needed
        // const widthInCm = (img.width / img.width * 2.54).toFixed(1);
        // const heightInCm = (img.height / img.height * 2.54).toFixed(1);
        this.photoPreview = e.target.result;
        this.photoFile = file;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  onSignatureSelect(event: any): void {
    const file = event.target.files[0];
    this.signatureError = null;

    if (!this.SIGNATURE_SPECS.allowedTypes.includes(file.type)) {
      this.signatureError = 'Only PNG, JPG/JPEG files are allowed';
      return;
    }

    if (file.size > this.SIGNATURE_SPECS.maxSize) {
      this.signatureError = `File size must be less than ${
        this.SIGNATURE_SPECS.maxSize / 1024
      }KB`;
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.signaturePreview = e.target.result;
      this.signatureFile = file;
    };
    reader.readAsDataURL(file);
  }

  onIdProofSelect(event: any): void {
    const file = event.target.files[0];
    this.idProofError = null;

    if (!this.ID_PROOF_SPECS.allowedTypes.includes(file.type)) {
      this.idProofError = 'Only PDF, PNG, JPG/JPEG files are allowed';
      return;
    }

    if (file.size > this.ID_PROOF_SPECS.maxSize) {
      this.idProofError = `File size must be less than ${
        this.ID_PROOF_SPECS.maxSize / 1024
      }KB`;
      return;
    }

    if (this.isPdf(file)) {
      this.idProofFile = file;
      this.idProofPreview = null;
    } else {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.idProofPreview = e.target.result;
        this.idProofFile = file;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(event: Event): void {
    event.stopPropagation();
    this.photoFile = null;
    this.photoPreview = null;
    this.photoError = null;
  }

  removeSignature(event: Event): void {
    event.stopPropagation();
    this.signatureFile = null;
    this.signaturePreview = null;
    this.signatureError = null;
  }

  removeIdProof(event: Event): void {
    event.stopPropagation();
    this.idProofFile = null;
    this.idProofPreview = null;
    this.idProofError = null;
  }

  isPdf(file: File): boolean {
    return file.type === 'application/pdf';
  }

  allDocumentsValid(): boolean {
    return (
      !!this.photoFile &&
      !!this.signatureFile &&
      !!this.idProofFile &&
      !this.photoError &&
      !this.signatureError &&
      !this.idProofError
    );
  }

  createForm(): FormGroup {
    const communicationGroup = this.fb.group({});
    this.communicationPersons.forEach((person) => {
      communicationGroup.addControl(
        person.id,
        this.fb.group({
          speaking: [false],
          listening: [false],
          reading: [false],
          writing: [false],
        })
      );
    });

    const attemptsArray: FormArray = this.fb.array([]);

    [1, 2, 3, 4, 5].forEach((level) => {
      const group = this.fb.group({
        level: [level],
        attempts: [0],
        result: [''],
      });

      attemptsArray.push(group); // ✅ Now works fine
    });

    return this.fb.group({
      specialArrangement: [false],
      testLevel: [null, Validators.required],
      testSite: [{ value: 'Pune', disabled: true }],
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      middleName: ['', Validators.pattern(/^[a-zA-Z]*$/)],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      gender: ['', Validators.required],
      nativeLanguage: ['', Validators.required],
      passcode: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      regSeq: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      dob: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      country: ['', Validators.required],
      pincode: ['', Validators.required],
      sameAsAddress: [true],
      institution: ['', Validators.required],
      learningPlace: ['', Validators.required],
      examReason: ['', Validators.required],
      occupation: ['', Validators.required],
      occupationalDetails: [''],
      mediaContacts: this.fb.array([]),
      communication: communicationGroup,
      attempts: attemptsArray,
      agreeTerms: [false, Validators.requiredTrue],
    });
  }

  get attemptsArray(): FormArray {
    return this.registrationForm.get('attempts') as FormArray;
  }

  ngOnInit(): void {
    this.filteredLanguages = this.registrationForm
      .get('nativeLanguage')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterLanguages(value))
      );
  }

  private _filterLanguages(value: string): any {
    console.log(value);

    const filterValue = value.toLowerCase();
    return this.languages.filter((language: any) =>
      language.label.toLowerCase().includes(filterValue)
    );
  }

  displayFn(code: string): string {
    const lang = this.languages.find((l) => l.value === code);
    return lang ? lang.label : '';
  }

  isPhaseCompleted(phaseId: string): boolean {
    return this.completedPhases.includes(phaseId);
  }

  isPhaseAccessible(phaseId: string): boolean {
    const currentIndex = this.phases.findIndex(
      (p) => p.id === this.currentPhase
    );
    const phaseIndex = this.phases.findIndex((p) => p.id === phaseId);

    // Allow navigation to completed phases or next logical phase
    return phaseIndex <= currentIndex + 1 || this.isPhaseCompleted(phaseId);
  }

  navigateToPhase(phaseId: string): void {
    if (this.isPhaseAccessible(phaseId)) {
      this.currentPhase = phaseId;
      if (phaseId == 'registration-form') {
        this.registrationForm = this.createForm();
      }
    }
  }

  completePhase(phaseId: string): void {
    if (!this.completedPhases.includes(phaseId)) {
      this.completedPhases.push(phaseId);
    }

    // Move to next phase
    const currentIndex = this.phases.findIndex((p) => p.id === phaseId);
    if (currentIndex < this.phases.length - 1) {
      this.currentPhase = this.phases[currentIndex + 1].id;
      if (phaseId == 'registration-form') {
        this.registrationForm = this.createForm();
      }
    }
  }

  previousPhase(): void {
    const currentIndex = this.phases.findIndex(
      (p) => p.id === this.currentPhase
    );
    if (currentIndex > 0) {
      this.currentPhase = this.phases[currentIndex - 1].id;
      if (this.currentPhase == 'registration-form') {
        this.registrationForm = this.createForm();
      }
    }
  }

  calculateProgress(): number {
    return Math.round((this.completedPhases.length / this.phases.length) * 100);
  }

  submitRegistration(): void {
    // In a real app, this would submit to your backend
    console.log('Registration submitted');
    this.completePhase('review');
    // Then navigate to confirmation page
  }

  validateName(input: any, fieldName: string): void {
    const value = input.value;
    const valid = /^[a-zA-Z]*$/.test(value);
    if (!valid) {
      input.value = value.replace(/[^a-zA-Z]/g, '');
      this.registrationForm.get(fieldName)?.setValue(input.value);
    }
  }

  validatePasscode(input: any): void {
    const value = input.value;
    const valid = /^[0-9]*$/.test(value);
    if (!valid) {
      input.value = value.replace(/[^0-9]/g, '');
      this.registrationForm.get('passcode')?.setValue(input.value);
    }
  }

  onOccupationChange(): void {
    const occupation = this.registrationForm.get('occupation')?.value;
    this.showOccupationalDetails = occupation == 5;
    if (!this.showOccupationalDetails) {
      this.registrationForm.get('occupationalDetails')?.reset();
    }
  }

  onMediaContactChange(event: any, value: number): void {
    const mediaArray = this.registrationForm.get('mediaContacts') as FormArray;
    if (event.target.checked) {
      mediaArray.push(new FormControl(value));
    } else {
      const index = mediaArray.controls.findIndex(
        (ctrl) => ctrl.value === value
      );
      mediaArray.removeAt(index);
    }
  }

  onCommunicationChange(event: any, personId: string, skill: string): void {
    const personGroup = (
      this.registrationForm.get('communication') as FormGroup
    ).get(personId) as FormGroup;
    personGroup.get(skill)?.setValue(event.target.checked);
  }

  getChangedValues(formGroup: FormGroup | FormArray): any {
    const changed: any = {};

    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup || control instanceof FormArray) {
        const nestedChanges = this.getChangedValues(control);
        if (Object.keys(nestedChanges).length > 0) {
          changed[key] = nestedChanges;
        }
      } else if (control?.dirty || control?.touched) {
        changed[key] = control.value;
      }
    });

    return changed;
  }

  dontSaveForm = false;
  saveProgress() {
    console.log('Form submitted:', this.registrationForm.value);
    let formValue = structuredClone(this.registrationForm.value);
    if (formValue.testLevel == null || formValue.testLevel == '') {
      this.dontSaveForm = true;
    } else {
      let changedValues = this.getChangedValues(this.registrationForm);
      changedValues['userId'] = localStorage.getItem('userId');

      if (this.registrationFormId != '') {
        changedValues['id'] = this.registrationFormId;
      }

      this.backendService.save(changedValues).subscribe(
        (result) => {
          this.registrationFormId = result.data.id;
        },
        (error: any) => {
          //console.log('!! error from updateAPI', error);
        }
      );
    }
  }

  onSubmit(): void {
    console.log('Form submitted:', this.registrationForm.value);
    // if (this.registrationForm.valid) {
    console.log('Form submitted:', this.registrationForm.value);
    let submitValue = this.registrationForm.value;
    submitValue['userId'] = localStorage.getItem('userId');
    if (this.registrationFormId != '') {
      submitValue['id'] = this.registrationFormId;
    }

    this.backendService.submit(submitValue).subscribe(
      (result) => {
        this.registrationFormId = result.data.id;
        this.currentPhase = 'upload-documents';
      },
      (error: any) => {
        //console.log('!! error from updateAPI', error);
      }
    );
    // Handle form submission
    // } else {
    // this.registrationForm.markAllAsTouched();
    // }
  }

  makePayment() {
    const amount = 50000; // in paise (₹500)

    this.backendService.createOrder(amount).subscribe((order) => {
      const options = {
        key: 'rzp_test_tf3fWY9RAOZR6D', // Replace with your Razorpay Test Key ID
        amount: order.amount,
        currency: 'INR',
        name: 'Test Payment',
        description: 'Test Transaction',
        order_id: order.id,
        handler: (response: any) => {
          console.log('Payment successful! ID: ' + response);
          this.backendService
            .verifyAndFetchDetails(response)
            .subscribe((details) => {
              console.log('✅ Full Payment Details:', details);
              // Now you can generate GST sheet or store to DB
            });
          // You can call your backend to verify payment here
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    });
  }
}
