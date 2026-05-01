import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="layout-wrap">
      <div class="layout-left">
        <router-outlet />
      </div>
      <aside class="layout-right">
        <app-sidebar />
      </aside>
    </div>
  `,
  styles: [`
    .layout-wrap {
      display: grid;
      grid-template-columns: 1fr 290px;
      gap: 16px;
      padding: 16px 20px;
      align-items: start;
      font-family: 'Open Sans', sans-serif;
    }

    .layout-left {
      min-width: 0;
    }

    .layout-right {
      position: sticky;
      top: 16px;
      max-height: calc(100vh - 32px);
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .layout-wrap {
        grid-template-columns: 1fr;
        padding: 12px;
      }
      .layout-right { position: static; }
    }
  `]
})
export class PageLayoutComponent {}
