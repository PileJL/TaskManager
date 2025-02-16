import { Component, OnInit } from '@angular/core';
import { TaskComponent } from "../task/task.component";
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-task-list',
  imports: [TaskComponent, NgFor],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit{
  taskList: Task[] = [];

  constructor(private taskService: TaskService) {}

  onTaskDeleted(taskId: string) {
    console.log('Task deleted event received for ID:', taskId);
    this.taskList = this.taskList.filter(task => task._id !== taskId);
  }


  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.taskList = tasks; // ✅ Assign tasks to taskList
        console.log('Tasks:', this.taskList);
      },
      error: (err) => {
        console.error('Failed to fetch tasks:', err);
      },
    });
  }

}
