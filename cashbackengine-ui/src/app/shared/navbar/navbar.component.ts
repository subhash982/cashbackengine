import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <mat-toolbar color="primary">
      <a routerLink="/" class="brand">
        <mat-icon>account_balance_wallet</mat-icon>
        <span>CashbackEngine</span>
      </a>
      <span class="spacer"></span>

      @if (auth.isLoggedIn()) {
        <a mat-button routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
        <a mat-button routerLink="/merchants" routerLinkActive="active-link">Merchants</a>
        <a mat-button routerLink="/transactions" routerLinkActive="active-link">Transactions</a>
        <a mat-button routerLink="/wallet" routerLinkActive="active-link">Wallet</a>
        @if (auth.isAdmin()) {
          <a mat-button routerLink="/admin" routerLinkActive="active-link">Admin</a>
        }
        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <span mat-menu-item disabled>{{ auth.currentUser()?.email }}</span>
          <button mat-menu-item (click)="auth.logout()">
            <mat-icon>logout</mat-icon> Logout
          </button>
        </mat-menu>
      } @else {
        <a mat-button routerLink="/auth/login">Login</a>
        <a mat-raised-button routerLink="/auth/register" color="accent">Sign Up</a>
      }
    </mat-toolbar>
  `,
  styles: [`
    mat-toolbar { position: sticky; top: 0; z-index: 100; }
    .brand { display: flex; align-items: center; gap: 8px; color: white; text-decoration: none; font-size: 20px; font-weight: 500; }
    .spacer { flex: 1; }
    .active-link { background: rgba(255,255,255,.15); border-radius: 4px; }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
}
