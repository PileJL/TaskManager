import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: "root"})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token'); // Check if token exists
  }

  login(token: string, user_id: string): void {
    localStorage.setItem('token', token); // Save token
    localStorage.setItem('user_id', user_id); // ✅ Save user ID
    this.isLoggedInSubject.next(true);
  }


  logout(): void {
    localStorage.removeItem('token'); // Remove token
    localStorage.removeItem('user_id'); // Remove user_id
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']); // ✅ Redirect to login page
  }
}
