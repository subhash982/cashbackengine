import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  if (password && confirm && password.value !== confirm.value) {
    confirm.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatProgressSpinnerModule, MatDividerModule, MatIconModule
  ],
  styles: [`
    mat-card { width: 100%; max-width: 600px; }
    .section-title { font-size: 13px; font-weight: 600; color: rgba(0,0,0,.54); letter-spacing: .5px; text-transform: uppercase; margin: 16px 0 8px; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
    mat-form-field { width: 100%; }
    .error-msg { color: #f44336; font-size: 13px; margin: 4px 0 8px; }
    .submit-btn { width: 100%; margin-top: 8px; height: 44px; }
    .signin-link { text-align: center; margin-top: 12px; font-size: 14px; }
  `],
  template: `
    <h3 class="h3">Create Account</h3>
    <div class="content-box">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Start earning cashback today</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">

            <!-- Account Info -->
            <div class="section-title">Account Information</div>

            <mat-form-field appearance="outline">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" autocomplete="username">
              @if (form.get('username')?.hasError('required') && form.get('username')?.touched) {
                <mat-error>Username is required</mat-error>
              }
              @if (form.get('username')?.hasError('maxlength')) {
                <mat-error>Max 70 characters</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" autocomplete="email">
              @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (form.get('email')?.hasError('email')) {
                <mat-error>Enter a valid email address</mat-error>
              }
            </mat-form-field>

            <div class="field-row">
              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="password" autocomplete="new-password">
                <button mat-icon-button matSuffix type="button" (click)="showPassword = !showPassword">
                  <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
                  <mat-error>Password is required</mat-error>
                }
                @if (form.get('password')?.hasError('minlength')) {
                  <mat-error>Minimum 8 characters</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Confirm Password</mat-label>
                <input matInput [type]="showPassword ? 'text' : 'password'" formControlName="confirmPassword" autocomplete="new-password">
                @if (form.get('confirmPassword')?.hasError('passwordMismatch') && form.get('confirmPassword')?.touched) {
                  <mat-error>Passwords do not match</mat-error>
                }
              </mat-form-field>
            </div>

            <mat-divider style="margin: 8px 0 4px"></mat-divider>

            <!-- Personal Info -->
            <div class="section-title">Personal Information</div>

            <div class="field-row">
              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="fname" autocomplete="given-name">
                @if (form.get('fname')?.hasError('maxlength')) {
                  <mat-error>Max 32 characters</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lname" autocomplete="family-name">
                @if (form.get('lname')?.hasError('maxlength')) {
                  <mat-error>Max 25 characters</mat-error>
                }
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Phone Number</mat-label>
              <input matInput type="tel" formControlName="phone" autocomplete="tel">
              @if (form.get('phone')?.hasError('maxlength')) {
                <mat-error>Max 20 characters</mat-error>
              }
            </mat-form-field>

            <mat-divider style="margin: 8px 0 4px"></mat-divider>

            <!-- Address -->
            <div class="section-title">Address <span style="font-weight:400;text-transform:none">(Optional)</span></div>

            <mat-form-field appearance="outline">
              <mat-label>Address Line 1</mat-label>
              <input matInput formControlName="address" autocomplete="address-line1">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Address Line 2</mat-label>
              <input matInput formControlName="address2" autocomplete="address-line2">
            </mat-form-field>

            <div class="field-row">
              <mat-form-field appearance="outline">
                <mat-label>City</mat-label>
                <input matInput formControlName="city" autocomplete="address-level2">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>State / Province</mat-label>
                <input matInput formControlName="state" autocomplete="address-level1">
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" style="max-width:200px">
              <mat-label>ZIP / Postal Code</mat-label>
              <input matInput formControlName="zip" autocomplete="postal-code">
            </mat-form-field>

            @if (error) {
              <p class="error-msg">{{ error }}</p>
            }

            <button mat-raised-button color="primary" type="submit" class="submit-btn"
                    [disabled]="form.invalid || loading">
              @if (loading) {
                <mat-spinner diameter="22" style="display:inline-block;margin-right:8px"></mat-spinner>
              }
              Create Account
            </button>

          </form>
        </mat-card-content>

        <mat-card-actions align="end">
          <span class="signin-link">Already have an account? <a routerLink="/auth/login">Sign In</a></span>
        </mat-card-actions>
      </mat-card>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  showPassword = false;
  loading = false;
  error = '';

  form = this.fb.group({
    username:        ['', [Validators.required, Validators.maxLength(70)]],
    email:           ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    password:        ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
    confirmPassword: ['', Validators.required],
    fname:           ['', Validators.maxLength(32)],
    lname:           ['', Validators.maxLength(25)],
    phone:           ['', Validators.maxLength(20)],
    address:         ['', Validators.maxLength(32)],
    address2:        ['', Validators.maxLength(70)],
    city:            ['', Validators.maxLength(50)],
    state:           ['', Validators.maxLength(50)],
    zip:             ['', Validators.maxLength(10)]
  }, { validators: passwordMatchValidator });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const { confirmPassword, ...payload } = this.form.value;

    this.auth.register(payload as any).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
