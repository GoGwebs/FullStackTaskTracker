import { Component, inject, input, Input, output } from '@angular/core';
import { FormBuilder, FormsModule, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDatepickerModule, NgbDateStruct, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Task } from '../task-card/task-card';
import { CreateTaskPayload, ITask } from '../../../models/i_task';
import { IFormTask } from '../../../models/task';
import { TaskMapper } from '../../../services/task_mapper/task-mapper';
import { CreateTaskDTO } from '../../../models/task_dto';

@Component({
  selector: 'app-task-form',
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    NgbDatepickerModule, 
    NgbTimepickerModule
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
  fb = inject(FormBuilder);
  mapperService = inject(TaskMapper);
  router = inject(Router);

  initialValue = input<Partial<ITask>>();
  submitLabel = input<string>('Create Task');
  submitted = output<CreateTaskDTO>();
  cancel = output<void>();

  form!: FormGroup;
  // Getters for easy template access
  get title()       { return this.form.get('title')!; }
  get description() { return this.form.get('description')!; }
  get status()      { return this.form.get('status')!; }
  get priority()    { return this.form.get('priority')!; }
  get dueDate()     { return this.form.get('dueDate')!; }

  todayDateTime = new Date().toISOString().slice(0,16); // for placeholder in error message
  
  date: NgbDateStruct | null = null;
  time = { hour: 13, minute: 30 };

  ngOnInit(): void {
    this.initForm();
    const initial = this.initialValue();
    if (initial) {
      console.log('Patching form with initial value:', initial.dueDate);
      this.form.patchValue(initial);
      if (initial.dueDate) {
        const today = initial.dueDate;
        this.date = {
          year:  today.getFullYear(),
          month: today.getMonth() + 1,
          day:   today.getDate(),
        };
        this.time = {
          hour:   today.getHours(),
          minute: today.getMinutes(),
        };
      }
    }
    
  }

  private initForm(){
    this.form = this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(100)]],
        description: [''],
        status: ['',
          [
            Validators.required,
              oneOf(['New', 'InProgress', 'Done']),
          ]
        ],
        priority: ['',
          [
            Validators.required,
              oneOf(['Low', 'Medium', 'High']),
          ]
        ],
        dueDate: ['', 
          [
            isoDateTime(), // ← updated from isoDate()
          ],
        ],
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
    console.log('Constructed Date from datepicker:', dt);
    return dt.toISOString().slice(0,16);
  }

  updateDueDate(): void {
    const iso = this.toIsoDateTime();
    this.form.patchValue({ dueDate: iso ?? '' });
  }

  onSubmit() {
    if (this.form.valid) {
      const payload = this.form.value as CreateTaskDTO;
      this.submitted.emit(payload);
    } else {
      this.form.markAllAsTouched();
    }
  }

  isInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

}
// Custom validator factory — checks value is one of the allowed options
function oneOf(allowed: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // let required handle empty values
    return allowed.includes(control.value)
      ? null
      : { oneOf: { allowed, actual: control.value } };
  };
}

function isoDateTime(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // optional — let required handle empty

    // ISO-8601 datetime pattern: yyyy-mm-ddTHH:mm or yyyy-mm-ddTHH:mm:ss
    const iso8601DateTimeRegex =
      /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

    if (!iso8601DateTimeRegex.test(control.value)) {
      return { isoDateTime: { actual: control.value } };
    }

    // Check it is also a real calendar date — rejects e.g. 2026-02-30T10:00
    const date = new Date(control.value);
    if (isNaN(date.getTime())) {
      return { isoDateTime: { actual: control.value } };
    }

    return null;
  };
}

