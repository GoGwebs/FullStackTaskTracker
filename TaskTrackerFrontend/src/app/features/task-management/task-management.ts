import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-management',
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    NgbDatepickerModule, 
    NgbTimepickerModule
  ],
  templateUrl: './task-management.html',
  styleUrl: './task-management.scss',
})
export class TaskManagement {
  @Input() id?: string;

  form!: FormGroup;
  isEditing = false;
  isLoading = false;
  isSubmitting = true;
  date: NgbDateStruct | null = null;
  time = { hour: 13, minute: 30 };

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(){
    this.form = this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(100)]],
        description: [''],
        status: [''],
        priority: [''],
        dueDate: [''],
    });
  }

  toIsoDateTime(): string | null {
    if (!this.date) return null;
    const dt = new Date(
      this.date.year,
      this.date.month - 1,
      this.date.day,
      this.time.hour,
      this.time.minute
    );
    return dt.toISOString();
  }

  updateDueDate(): void {
    const iso = this.toIsoDateTime();
    this.form.patchValue({ dueDate: iso ?? '' });
  }

  onSubmit() {
    // Mark all fields as touched to trigger validation messages
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    console.log('Form Value:', this.form.value);

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate(['/tasks']);
    }, 1500);
  }

}
