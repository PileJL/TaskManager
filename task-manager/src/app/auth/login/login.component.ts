import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form!: FormGroup;
    apiUrl = 'http://localhost:3000/api/auth/login';  // API URL

    constructor(private http: HttpClient, private router: Router, private authService: AuthService){

    }

    ngOnInit(): void {
      this.form = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required, Validators.minLength(8)])
      });
    }

    login() {
      if (this.form.invalid) return;

      this.http.post<{ token: string; user: { id: string } }>(this.apiUrl, this.form.value).subscribe({
        next: (response) => {
          console.log("Login Response:", response); // Debugging

          this.authService.login(response.token, response.user.id); // ✅ Use `id`, not `_id`
          this.router.navigate(['/task-list']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Invalid credentials.');
        },
      });
    }
}
