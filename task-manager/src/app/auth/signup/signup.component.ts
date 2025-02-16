import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  form!: FormGroup;
  apiUrl = 'http://localhost:3000/api/auth/register';  // API URL

  constructor(private http: HttpClient, private router: Router){

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.maxLength(40)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  signUp() {
    if (this.form.invalid) return;  // Prevent API call if form is invalid

    const userData = this.form.value; // Get form data
    this.http.post(this.apiUrl, userData).subscribe({
      next: (response) => {
        console.log('User registered successfully:', response);
        alert('Registration successful!');  // ✅ Success Message
        this.form.reset();  // Clear form after success
        this.router.navigate(['/login']);  // ✅ Redirect to login
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Registration failed. Please try again.');  // ❌ Error Message
      }
    });
  }
}
