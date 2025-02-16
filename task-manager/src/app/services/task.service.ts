import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, tap } from 'rxjs/operators';
import { Task } from "../models/task.model";

@Injectable({ providedIn: "root" })
export class TaskService {
  private apiUrl = "http://localhost:3000/api/tasks"; // API Endpoint

  constructor(private http: HttpClient) {}

  // Get JWT token from local storage (or wherever it's stored)
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("token"); // Adjust storage method if needed
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
  }

  // ✅ Fetch tasks for logged-in user
  getTasks(): Observable<Task[]> {
    const token = localStorage.getItem('token'); // Retrieve token
    const user_id = localStorage.getItem('user_id'); // Ensure correct key

    console.log("🔍 Checking localStorage:", { token, user_id });

    if (!token || !user_id) {
        console.error("❌ No token or user_id found!");
        return throwError(() => new Error("User not authenticated"));
    }

    const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    });

    return this.http.get<any[]>(`${this.apiUrl}/user/${user_id}`, { headers }).pipe(
        tap((response) => console.log("✅ API Response:", response)),
        map((tasks) =>
            tasks.map(
                (task) =>
                    new Task(
                        task._id,
                        task.user_id,
                        task.title,
                        task.description,
                        new Date(task.dueDate),
                        task.completed
                    )
            )
        ),
        tap((mappedTasks) => console.log("✅ Mapped Tasks:", mappedTasks))
    );
  }

  // Delete a task
  deleteTask(taskId: string): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Add token to headers
    });

    return this.http.delete(`${this.apiUrl}/${taskId}`, { headers });
  }


  // Add a task
  createTask(taskData: any): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.apiUrl}`, taskData, { headers });
  }

  // Update a task
  updateTask(taskId: string, updatedTask: Partial<Task>): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // Retrieve token from localStorage
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiUrl}/${taskId}`, updatedTask, { headers });
  }

  // ✅ Mark a task as complete
  markTaskAsComplete(taskId: string): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}` // Add token to headers
    });

    return this.http.patch(`${this.apiUrl}/${taskId}/complete`, {}, { headers });
  }

  // get task by ID
  getTaskById(taskId: string): Observable<Task> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is included
    });

    return this.http.get<Task>(`${this.apiUrl}/${taskId}`, { headers }); // ✅ Ensure correct URL
  }
}
