import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../models/task.model';

function minDateValidator(control: AbstractControl): ValidationErrors | null {
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

  return selectedDate < today ? { minDate: true } : null;
}

@Component({
  selector: 'app-add-edit-task',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-edit-task.component.html',
  styleUrl: './add-edit-task.component.css'
})
export class AddEditTaskComponent {
  form!: FormGroup;
  taskId: string | null = null;
  isEditMode = false;

  constructor(private taskService: TaskService, private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      dueDate: new FormControl(null, [Validators.required, minDateValidator]),
    });

    // ✅ Check if editing
    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('id');
      if (this.taskId) {
        this.isEditMode = true;
        this.loadTask(this.taskId);
      }
    });
  }

  // ✅ Fetch task details and populate the form
  private loadTask(id: string) {
    this.taskService.getTaskById(id).subscribe({
      next: (task: Task) => {
        this.form.patchValue({
          title: task.title,
          description: task.description,
          dueDate: new Date(task.dueDate).toISOString().split('T')[0] // Format date properly
        });
      },
      error: (err) => console.error('Error fetching task:', err)
    });
  }

  saveTask() {
    if (this.form.invalid) {
      console.error("Form is invalid");
      return;
    }

    const taskData = {
      title: this.form.value.title,
      description: this.form.value.description,
      dueDate: new Date(this.form.value.dueDate),
    };

    console.log("Task Data:", taskData); // 🔍 Log taskData before sending

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Unauthorized: No token found");
      return;
    }

    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, taskData).subscribe({
        next: () => {
          alert('Task updated successfully!');
          this.router.navigate(['/task-list']);
        },
        error: (err) => alert(`Failed to update task: ${err.error?.error || 'Unknown error'}`)
      });
    }
    else {
      this.taskService.createTask(taskData).subscribe({
        next: () => {
          alert('Task added successfully!');
          this.router.navigate(['/task-list']);
        },
        error: (err) => alert(`Failed to add task: ${err.error?.error || 'Unknown error'}`)
      });
    }
  }

}


