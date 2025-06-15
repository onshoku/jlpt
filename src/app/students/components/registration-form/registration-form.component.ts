import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { BackendService } from 'src/app/core/api.service';
import { S3UploadService } from 'src/app/core/upload.service';

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
  newRegistration = false;

  phases = [
    { id: 'important-notes', name: 'Important Notes' },
    { id: 'registration-form', name: 'Registration Form' },
    { id: 'upload-documents', name: 'Documents' },
    { id: 'undertaking', name: 'Undertaking' },
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
  registrationFormData: any = {};

  paymentAmt = 500;

  confirmed = false;
  agreeTermsUndertaking = false;
  paymentDone = false;
  paymentDetails = {};
  underTakingDetails: any = {};

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

  hasQueryParams = false;
  invalidUpload = false;
  constructor(
    private fb: FormBuilder,
    private backendService: BackendService,
    private route: ActivatedRoute,
    private s3UploadService: S3UploadService,
    private sanitizer: DomSanitizer
  ) {
    this.registrationForm = this.createForm();

    this.route.queryParams.subscribe((params) => {
      console.log('Query Params:', params);

      // Example: Access specific parameter
      const level = params['level'];
      if (level) {
        this.hasQueryParams = true;
        let testLevel = level.slice(1, 2);
        this.newRegistration = true;
        this.patchFormValues({ testLevel: testLevel });
        console.log('Exam ID from query:', testLevel);
      } else {
        this.hasQueryParams = false;
      }
    });
  }

  photoFile: File | null = null;
  photoPreview: any = null;
  photoError: string | null = null;

  signatureFile: File | null = null;
  signaturePreview: any = null;
  signatureError: string | null = null;

  idProofFile: File | null = null;
  idProofPreview: any = null;
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

  levelWisePayment: any = {
    1: 1770,
    2: 1770,
    3: 1416,
    4: 1298,
    5: 1180,
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

  acceptUndertakingForm() {
    if (this.agreeTermsUndertaking && !this.registrationFormData.acceptUnderTakingAndAffidavit) {
      let changedValues: any = {};
      changedValues['userId'] = localStorage.getItem('userId') || '';
      changedValues['progress'] = 60;
      changedValues['testLevel'] = this.registrationFormData['testLevel'];
      changedValues['underTakingAcceptDate'] = new Date().toISOString();
      changedValues['acceptUnderTakingAndAffidavit'] = true;

      if (this.registrationFormId != '') {
        changedValues['id'] = this.registrationFormId;
      }

      this.backendService.save(changedValues).subscribe(
        (result) => {
          this.registrationFormId = result.data.id;
          console.log('result', result);

          this.completePhase('undertaking');
        },
        (error: any) => {
          //console.log('!! error from updateAPI', error);
        }
      );
    }else{
      this.completePhase('undertaking');
    }
  }

  async uploadPictures(): Promise<void> {

    if(this.registrationFormData.uploadedDocuments && this.photoFile && this.signatureFile && this.idProofFile){
      this.completePhase('upload-documents');
    }else{

      if (!this.allDocumentsValid()) {
        this.invalidUpload = true;
        return;
      }
  
      try {
        this.invalidUpload = false;
        let userId = localStorage.getItem('userId') || '';
        let regId = this.registrationFormId;
        // Upload photo
        const photoUrl = await this.s3UploadService.uploadToS3UsingPresignedUrl(
          this.photoFile!,
          userId,
          regId,
          'photo'
        );
  
        // Upload signature
        const signatureUrl =
          await this.s3UploadService.uploadToS3UsingPresignedUrl(
            this.signatureFile!,
            userId,
            regId,
            'signature'
          );
  
        // Upload ID proof
        const idProofUrl = await this.s3UploadService.uploadToS3UsingPresignedUrl(
          this.idProofFile!,
          userId,
          regId,
          'id_proof'
        );
  
        // Now you can save these URLs to your database
        console.log('Uploaded files:', {
          photoUrl,
          signatureUrl,
          idProofUrl,
        });
  
        let changedValues: any = {};
        changedValues['userId'] = userId;
        changedValues['progress'] = 40;
        changedValues['testLevel'] = this.registrationFormData['testLevel'];
        changedValues['documentSubmissionDate'] = new Date().toISOString();
        changedValues['uploadedDocuments'] = {
          photo: photoUrl,
          signature: signatureUrl,
          id_proof: idProofUrl,
        };
  
        if (this.registrationFormId != '') {
          changedValues['id'] = this.registrationFormId;
        }
  
        this.backendService.save(changedValues).subscribe(
          (result) => {
            this.registrationFormId = result.data.id;
            console.log('result', result);
  
            this.completePhase('upload-documents');
          },
          (error: any) => {
            //console.log('!! error from updateAPI', error);
          }
        );
  
        // Show success message
        // this.uploadSuccess.emit({
        //   photoUrl,
        //   signatureUrl,
        //   idProofUrl
        // });
      } catch (error) {
        console.error('Upload failed:', error);
        // this.uploadError.emit('Failed to upload documents. Please try again.');
      }
    }
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
      // regSeq: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
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
    let progress = this.registrationFormData.progress || 0;

    if (progress < 20) {
    }
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
      console.log('Current Phase', this.currentPhase);
      if (phaseId == 'registration-form') {
        this.registrationForm = this.createForm();
        this.patchFormValues(this.registrationFormData);
      } else if (phaseId == 'payment') {
        let level =
          this.registrationForm.value.testLevel ||
          this.registrationFormData.testLevel;

        this.paymentAmt = this.levelWisePayment[level];
      } else if (phaseId == 'upload-documents') {
        this.invalidUpload = false;
      } else if (phaseId == 'undertaking') {
        console.log('Undertaking phase');

        this.constructUnderTakingDetail();
      }
    }
  }

  completePhase(phaseId: string): void {
    console.log("COmpleteting phase",phaseId)
    if (!this.completedPhases.includes(phaseId)) {
      this.completedPhases.push(phaseId);
    }

    // Move to next phase
    const currentIndex = this.phases.findIndex((p) => p.id === phaseId);
    if (currentIndex < this.phases.length - 1) {
      this.currentPhase = this.phases[currentIndex + 1].id;
      if (phaseId == 'registration-form' || phaseId == 'important-notes') {
        this.registrationForm = this.createForm();
        this.patchFormValues(this.registrationFormData);
      } else if (phaseId == 'payment') {
        let level =
          this.registrationForm.value.testLevel ||
          this.registrationFormData.testLevel;

        this.paymentAmt = this.levelWisePayment[level];

        if(this.registrationFormData.hasOwnProperty('pid')){
          this.paymentDone = true
        }
      } else if (phaseId == 'upload-documents') {
        this.invalidUpload = false;
      } else if (phaseId == 'undertaking') {
        this.constructUnderTakingDetail();
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
        this.patchFormValues(this.registrationFormData);
      } else if (this.currentPhase == 'payment') {
        let level =
          this.registrationForm.value.testLevel ||
          this.registrationFormData.testLevel;

        this.paymentAmt = this.levelWisePayment[level];
        if(this.registrationFormData.hasOwnProperty('pid')){
          this.paymentDone = true
        }
      } else if ((this.currentPhase = 'upload-documents')) {
        this.invalidUpload = false;
      } else if ((this.currentPhase = 'undertaking')) {
        this.constructUnderTakingDetail();
      }
    }
  }

  calculateProgress(): number {
    return this.registrationFormData.progress || 0;
  }

  submitRegistration(): void {
    // In a real app, this would submit to your backend
    console.log('Registration submitted');
    let changedValues:any = {};
      changedValues['userId'] = localStorage.getItem('userId');
      changedValues['progress'] = 100;
      changedValues['testLevel'] = this.registrationFormData['testLevel'];
      changedValues['finalSubmissionDate'] =  new Date().toISOString();

      if (this.registrationFormId != '') {
        changedValues['id'] = this.registrationFormId;
      }

      this.backendService.save(changedValues).subscribe(
        (result) => {
          // this.registrationFormId = result.data.id;
          this.completePhase('review');
          this.toggleNewRegistartion(false)
        },
        (error: any) => {
          //console.log('!! error from updateAPI', error);
        }
      );
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
      changedValues['progress'] = 10;
      changedValues['testLevel'] = this.registrationForm.value['testLevel'];

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
    if(!this.registrationFormData.progress)
    submitValue['progress'] = 20;
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
    const amount = this.paymentAmt * 100; // in paise (₹500)

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
              details['userId'] = localStorage.getItem('userId') || '';
              details['formId'] = this.registrationFormId;
              this.backendService.savePayment(details).subscribe(
                (result:any) => {
                  console.log('result', result);
                  let pid = result.data.pid;
                  let changedValues: any = {};
                  changedValues['userId'] =
                    localStorage.getItem('userId') || '';
                  changedValues['progress'] = 80;
                  changedValues['testLevel'] =
                    this.registrationFormData['testLevel'];
                  changedValues['paymentDate'] = new Date().toISOString();
                  changedValues['pid'] = pid;
                  changedValues['paymentAmount'] = details.amount / 100;

                  if (this.registrationFormId != '') {
                    changedValues['id'] = this.registrationFormId;
                  }

                  this.backendService.save(changedValues).subscribe(
                    (result) => {
                      console.log('result', result);
                      this.paymentDone = true;
                      this.completePhase('payment')
                    },
                    (error: any) => {
                      console.log('!! error from updateAPI', error);
                    }
                  );

                  // this.completePhase('payment')
                },
                (error: any) => {
                  console.log('!! error from updateAPI', error);
                }
              );
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

  toggleNewRegistartion(value: any) {
    if (value.id) {
      this.backendService.getFormsById(value.id).subscribe({
        next: (res) => {
          this.registrationFormData = res.data;
          this.registrationFormId = res.data.id || '';
          let progress = res.data.progress || 0;
          if (progress < 10) {
            this.currentPhase = 'important-notes';
          } else if (progress >= 10 && progress < 20) {
            this.currentPhase = 'registration-form';
            this.registrationForm = this.createForm();
            this.patchFormValues(res.data);
            this.completedPhases.push('important-notes');
          } else if (progress >= 20 && progress < 40) {
            this.currentPhase = 'upload-documents';
            this.invalidUpload = false;
            this.completedPhases.push('important-notes');
            this.completedPhases.push('registration-form');
          } else if (progress >= 40 && progress < 60) {
            this.currentPhase = 'undertaking';
            this.agreeTermsUndertaking = res.data.acceptUnderTakingAndAffidavit;

             if(this.registrationFormData.uploadedDocuments.photo){
              this.getUploadedDocumentsPhoto(this.registrationFormData.uploadedDocuments.photo);
            }
            if(this.registrationFormData.uploadedDocuments.id_proof){
              this.getUploadedDocumentsIDProof(this.registrationFormData.uploadedDocuments.id_proof);
            }
            if(this.registrationFormData.uploadedDocuments.signature){
              this.getUploadedDocumentsSignature(this.registrationFormData.uploadedDocuments.signature);
            }

            this.completedPhases.push('important-notes');
            this.completedPhases.push('registration-form');
            this.completedPhases.push('upload-documents');
            this.constructUnderTakingDetail();
          } else if (progress >= 60 && progress < 80) {
            this.currentPhase = 'payment';
            let level =
              this.registrationForm.value.testLevel ||
              this.registrationFormData.testLevel;

             if(this.registrationFormData.uploadedDocuments.photo){
              this.getUploadedDocumentsPhoto(this.registrationFormData.uploadedDocuments.photo);
            }
            if(this.registrationFormData.uploadedDocuments.id_proof){
              this.getUploadedDocumentsIDProof(this.registrationFormData.uploadedDocuments.id_proof);
            }
            if(this.registrationFormData.uploadedDocuments.signature){
              this.getUploadedDocumentsSignature(this.registrationFormData.uploadedDocuments.signature);
            }
            this.paymentAmt = this.levelWisePayment[level];
            this.completedPhases.push('important-notes');
            this.completedPhases.push('registration-form');
            this.completedPhases.push('upload-documents');
            this.completedPhases.push('undertaking');
            this.constructUnderTakingDetail()
          } else if (progress >= 80 && progress < 100) {
            this.currentPhase = 'review';

             if(this.registrationFormData.uploadedDocuments.photo){
              this.getUploadedDocumentsPhoto(this.registrationFormData.uploadedDocuments.photo);
            }
            if(this.registrationFormData.uploadedDocuments.id_proof){
              this.getUploadedDocumentsIDProof(this.registrationFormData.uploadedDocuments.id_proof);
            }
            if(this.registrationFormData.uploadedDocuments.signature){
              this.getUploadedDocumentsSignature(this.registrationFormData.uploadedDocuments.signature);
            }
            this.constructUnderTakingDetail()

            this.completedPhases.push('important-notes');
            this.completedPhases.push('registration-form');
            this.completedPhases.push('upload-documents');
            this.completedPhases.push('undertaking');
            this.completedPhases.push('payment');
          } else if (progress >= 100) {
            this.completedPhases.push('important-notes');
            this.completedPhases.push('registration-form');
            this.completedPhases.push('upload-documents');
            this.completedPhases.push('undertaking');
            this.completedPhases.push('payment');
            this.completedPhases.push('review');
            this.constructUnderTakingDetail()
            if(this.registrationFormData.uploadedDocuments.photo){
              this.getUploadedDocumentsPhoto(this.registrationFormData.uploadedDocuments.photo);
            }
            if(this.registrationFormData.uploadedDocuments.id_proof){
              this.getUploadedDocumentsIDProof(this.registrationFormData.uploadedDocuments.id_proof);
            }
            if(this.registrationFormData.uploadedDocuments.signature){
              this.getUploadedDocumentsSignature(this.registrationFormData.uploadedDocuments.signature);
            }
          }

          if(this.registrationFormData.hasOwnProperty('pid')){
          this.paymentDone = true
        }
          this.newRegistration = value;
        },
        error: (err) => {
          // this.isLoading = false;
        },
      });
    } else {
      this.newRegistration = value;
      this.registrationFormData = {};
      this.completedPhases = [];
      this.registrationFormId = '';
    }
  }

  patchFormValues(apiData: any) {
    // Patch the form with API data
    this.registrationForm.patchValue({
      specialArrangement: apiData.specialArrangement,
      testLevel: apiData.testLevel,
      testSite: 'Pune', // Since it's disabled, you might not need to patch this
      firstName: apiData.firstName,
      middleName: apiData.middleName,
      lastName: apiData.lastName,
      gender: apiData.gender,
      nativeLanguage: apiData.nativeLanguage,
      passcode: apiData.passcode,
      // regSeq: apiData.regSeq,
      dob: apiData.dob,
      address1: apiData.address1,
      address2: apiData.address2,
      country: apiData.country,
      pincode: apiData.pincode,
      sameAsAddress: apiData.sameAsAddress,
      institution: apiData.institution,
      learningPlace: apiData.learningPlace,
      examReason: apiData.examReason,
      occupation: apiData.occupation,
      occupationalDetails: apiData.occupationalDetails,
      agreeTerms: apiData.agreeTerms,
    });

    // Patch the communication group
    const communicationGroup = this.registrationForm.get(
      'communication'
    ) as FormGroup;
    if (apiData.communication) {
      Object.keys(apiData.communication).forEach((key) => {
        if (communicationGroup.get(key)) {
          communicationGroup.get(key)?.patchValue(apiData.communication[key]);
        }
      });
    }

    // Patch the attempts array
    const attemptsArray = this.registrationForm.get('attempts') as FormArray;
    if (apiData.attempts)
      apiData.attempts.forEach((attempt: any, index: any) => {
        if (attemptsArray.at(index)) {
          attemptsArray.at(index).patchValue(attempt);
        }
      });

    // Patch mediaContacts
    const mediaContactsArray = this.registrationForm.get('mediaContacts') as FormArray;
  mediaContactsArray.clear(); // Clear existing values
  if (apiData.mediaContacts && Array.isArray(apiData.mediaContacts)) {
    apiData.mediaContacts.forEach((contact: any) => {
      mediaContactsArray.push(this.fb.control(contact));
    });
  }
  }

  constructUnderTakingDetail() {
    let name = '';
    if (this.registrationFormData.firstName) {
      name += this.registrationFormData.firstName;
    }
    if (this.registrationFormData.lastName) {
      name += ' ' + this.registrationFormData.lastName;
    }

    let dob = '';
    if (this.registrationFormData.dob) {
      dob = new Date(this.registrationFormData.dob).toLocaleDateString('en-US');
    }

    let address = '';
    if (this.registrationFormData.address1) {
      address += this.registrationFormData.address1;
    }
    if (this.registrationFormData.address2) {
      address += ' ' + this.registrationFormData.address2;
    }

    let institution = '';
    if (this.registrationFormData.institution) {
      institution = this.registrationFormData.institution;
    }

    let testLevel = '';
    if (this.registrationFormData.testLevel) {
      testLevel = this.registrationFormData.testLevel;
    }

    this.underTakingDetails = {
      name: name,
      dob: dob,
      address: address,
      institution: institution,
      testLevel: testLevel,
      date: new Date().toLocaleDateString('en-US'),
    };

    if (
      this.registrationFormData.hasOwnProperty('acceptUnderTakingAndAffidavit')
    ) {
      this.agreeTermsUndertaking =
        this.registrationFormData.acceptUnderTakingAndAffidavit;
    }
  }


  // Helper methods to get display values
getLanguageName(code: string): string {
  const lang = this.languages.find(l => l.value === code);
  return lang ? lang.label : code;
}

getLearningPlace(code: number): string {
  const places = [
    { value: '1', label: 'School' },
    { value: '2', label: 'Private Language School' },
    { value: '3', label: 'University' },
    { value: '4', label: 'Self-study' },
    { value: '5', label: 'Other' }
  ];
  const place = this.learningPlaces.find(p => p.value == code);
  return place ? place.label : code + '';
}

getExamReason(code: number): string {
  const reasons = [
    { value: '1', label: 'For Employment' },
    { value: '2', label: 'For Promotion' },
    { value: '3', label: 'For Higher Education' },
    { value: '4', label: 'Personal Interest' },
    { value: '5', label: 'Other' }
  ];
  const reason = this.examReasons.find(r => r.value == code);
  return reason ? reason.label : code + '';
}

getOccupation(code: number): string {
  const occupations = [
    { value: '1', label: 'Student' },
    { value: '2', label: 'Company Employee' },
    { value: '3', label: 'Government Employee' },
    { value: '4', label: 'Self-employed' },
    { value: '5', label: 'Other' }
  ];
  const occupation = this.occupationalDetails.find(o => o.value == code);
  return occupation ? occupation.label : code + '';
}

getUploadedDocumentsPhoto(url:string){
  
  this.s3UploadService.getPresignedURL(this.extractS3KeyFromPresignedUrl(url)).subscribe({
    next: (res:any) => {
      console.log(res);
      let imageUrl = res.imageUrl
      // this.assignPresignedUrlToFile(imageUrl,'document.jpg')
      this.s3UploadService.presignedUrlToFile(imageUrl, 'photo')
      .subscribe((file:any) => {
        console.log('File created:', file);
        console.log('File name:', file.name);
        console.log('File size:', file.size);
        console.log('File type:', file.type);
        this.photoFile = file
        const reader = new FileReader();
    reader.onload = (e: any) => {
      // Sanitize the URL for security
      this.photoPreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
    };
    reader.readAsDataURL(file);
        // Now you can use this File object for uploads or other processing
      }, (error:any) => {
        console.error('Error converting URL to file:', error);
      });
      },
      error: (err:any) => {},
    });
}

getUploadedDocumentsIDProof(url:string){
  
  this.s3UploadService.getPresignedURL(this.extractS3KeyFromPresignedUrl(url)).subscribe({
    next: (res:any) => {
      console.log(res);
      let imageUrl = res.imageUrl
      // this.assignPresignedUrlToFile(imageUrl,'document.jpg')
      this.s3UploadService.presignedUrlToFile(imageUrl, 'id-proof')
      .subscribe((file:any) => {
        console.log('File created:', file);
        console.log('File name:', file.name);
        console.log('File size:', file.size);
        console.log('File type:', file.type);
        this.idProofFile = file
        const reader = new FileReader();
    reader.onload = (e: any) => {
      // Sanitize the URL for security
      this.idProofPreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
    };
    reader.readAsDataURL(file);
        // Now you can use this File object for uploads or other processing
      }, (error:any) => {
        console.error('Error converting URL to file:', error);
      });
      },
      error: (err:any) => {},
    });
}

getUploadedDocumentsSignature(url:string){
  
  this.s3UploadService.getPresignedURL(this.extractS3KeyFromPresignedUrl(url)).subscribe({
    next: (res:any) => {
      console.log(res);
      let imageUrl = res.imageUrl
      // this.assignPresignedUrlToFile(imageUrl,'document.jpg')
      this.s3UploadService.presignedUrlToFile(imageUrl, 'signature')
      .subscribe((file:any) => {
        console.log('File created:', file);
        console.log('File name:', file.name);
        console.log('File size:', file.size);
        console.log('File type:', file.type);
        this.signatureFile = file
        const reader = new FileReader();
    reader.onload = (e: any) => {
      // Sanitize the URL for security
      this.signaturePreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
    };
    reader.readAsDataURL(file);
        // Now you can use this File object for uploads or other processing
      }, (error:any) => {
        console.error('Error converting URL to file:', error);
      });
      },
      error: (err:any) => {},
    });
}
 extractS3KeyFromPresignedUrl(url:any) {
  try {
    const urlObj = new URL(url);
    // Split at '?' to remove query parameters and get just the path
    const pathOnly = urlObj.pathname.substring(1).split('?')[0];
    return encodeURIComponent(pathOnly);
  } catch (error) {
    console.error('Error extracting S3 key:', error);
    return '';
  }
}

async assignPresignedUrlToFile(url: string, fileName: string): Promise<void> {
  try {
    // Add a timestamp to bust cache
    const noCacheUrl = url;

    const response = await fetch(noCacheUrl, {
      method: 'GET',
      cache: 'no-store' // prevents using HTTP cache
    });

    const blob = await response.blob();

    const fileType = blob.type || 'application/octet-stream';

    this.photoFile = new File([blob], fileName, { type: fileType });
  } catch (error) {
    console.error('Failed to fetch or convert file from presigned URL:', error);
    this.photoFile = null;
  }
}

getMediaContact(code: number): string {
  const mediaContacts = [
    { value: 1, label: 'TV/Radio' },
    { value: 2, label: 'Newspapers/Magazines' },
    { value: 3, label: 'Books' },
    { value: 4, label: 'Internet' },
    { value: 5, label: 'Friends/Family' },
    { value: 6, label: 'School' },
    { value: 7, label: 'Other' }
  ];
  const media = this.mediaContacts.find(m => m.value === code);
  return media ? media.label : code.toString();
}

finalSubmit() {
  // Handle final submission logic here
  console.log('Final submission:', this.registrationFormData);

}
}
