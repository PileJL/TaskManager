import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../models/task.model';
import { DatePipe, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TaskService } from '../services/task.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-task',
  imports: [NgIf, CommonModule, RouterLink],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
  providers: [DatePipe]
})
export class TaskComponent {
  @Input() task?: Task;
  @Output() taskDeleted = new EventEmitter<string>(); // Emits task ID when deleted

  constructor(private datePipe: DatePipe, private taskService: TaskService, private router: Router) {}

  get formattedDueDate(): string {
    return this.datePipe.transform(this.task?.dueDate, 'MMMM d, y') || 'No Date';
  }

  editTask() {
    if (!this.task) return;
    this.router.navigate(['/task/edit', this.task._id]); // ✅ Navigate to edit page with task ID
  }

  deleteTask() {
    if (!this.task) return; // Ensure task exists

    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.task._id).subscribe({
        next: () => {
          console.log('Task deleted successfully');
          this.taskDeleted.emit(this.task!._id); // ✅ Emit task ID
        },
        error: (err) => {
          console.error('Failed to delete task:', err);
        }
      });
    }
  }



  // ✅ Mark task as complete
  markAsComplete() {
    if (!this.task || this.task.completed) return; // Prevent duplicate marking

    this.taskService.markTaskAsComplete(this.task._id).subscribe({
      next: () => {
        this.task!.completed = true; // Use non-null assertion
      },
      error: (err) => {
        console.error('Failed to mark task as complete:', err);
      }
    });
  }

}
