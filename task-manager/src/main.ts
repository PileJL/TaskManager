import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './app/auth/login/login.component';
import { SignupComponent } from './app/auth/signup/signup.component';
import { TaskListComponent } from './app/task-list/task-list.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './app/auth.interceptor';
import { AuthGuard } from './app/auth.guard';
import { AddEditTaskComponent } from './app/add-edit-task/add-edit-task.component';

const routes: Routes = [
  {path: '', redirectTo: 'task-list', pathMatch:'full'},
  {path: 'task-list', component: TaskListComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'add-task', component: AddEditTaskComponent},
  { path: 'edit-task/:id', component: AddEditTaskComponent },
];
bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideRouter(routes), {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}]
})
.catch(err => console.error(err));
