import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BookComponent } from './book/book.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BookComponent, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'BookFrontend';
  currentView = 'dashboard';

  showDashboard() {
    this.currentView = 'dashboard';
  }

  showBooks() {
    this.currentView = 'books';
  }
}
