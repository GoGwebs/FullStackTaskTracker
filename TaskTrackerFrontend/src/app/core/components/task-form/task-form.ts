import { Component, inject, input, Input, output } from '@angular/core';
import { FormBuilder, FormsModule, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  
  date: NgbDateStruct | null = null;
  time = { hour: 13, minute: 30 };

  ngOnInit(): void {
    this.initForm();
    const initial = this.initialValue();
    console.log('About to patch:', initial);
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
    if (this.form.valid) {
      const payload = this.form.value as CreateTaskDTO;
      this.submitted.emit(payload);
    } else {
      this.form.markAllAsTouched();
    }
  }

}
