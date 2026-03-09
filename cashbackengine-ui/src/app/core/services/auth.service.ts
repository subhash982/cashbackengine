import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, UserProfile } from '../models/auth.model';
import { ApiResponse } from '../models/transaction.model';

const TOKEN_KEY = 'cashback_token';
const USER_KEY = 'cashback_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiBaseUrl;

  isLoggedIn = signal(!!localStorage.getItem(TOKEN_KEY));
  currentUser = signal<UserProfile | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/register`, request).pipe(
      tap(res => this.storeAuth(res.data))
    );
  }

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/login`, request).pipe(
      tap(res => this.storeAuth(res.data))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  private storeAuth(auth: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, auth.accessToken);
    this.isLoggedIn.set(true);
    this.http.get<ApiResponse<UserProfile>>(`${this.apiUrl}/users/me`).subscribe(res => {
      localStorage.setItem(USER_KEY, JSON.stringify(res.data));
      this.currentUser.set(res.data);
    });
  }

  private loadUser(): UserProfile | null {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
