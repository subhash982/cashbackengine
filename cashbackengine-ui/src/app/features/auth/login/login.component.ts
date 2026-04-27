import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Sign In</mat-card-title>
          <mat-card-subtitle>Welcome back to CashbackEngine</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="you@example.com">
              <mat-error *ngIf="form.get('email')?.invalid">Valid email required</mat-error>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password">
              <mat-error *ngIf="form.get('password')?.invalid">Password required</mat-error>
            </mat-form-field>
            @if (error) {
              <p class="error-msg">{{ error }}</p>
            }
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading" style="width:100%;margin-top:8px">
              @if (loading) { <mat-spinner diameter="20" style="display:inline-block"></mat-spinner> }
              @else { Sign In }
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions align="end">
          <span>Don't have an account? <a routerLink="/auth/register">Register</a></span>
        </mat-card-actions>
      </mat-card>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = false;
  error = '';

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        const destination = this.auth.isAdmin() ? '/admin' : '/home';
        this.router.navigate([destination]);
      },
      error: (err) => {
        this.error = err.error?.message || 'Invalid credentials';
        this.loading = false;
      }
    });
  }
}
