import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Book } from '../book/book.model';
import { BookService } from '../book/book.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('authorChart') chartRef!: ElementRef<HTMLCanvasElement>;

  latestBooks: Book[] = [];
  oldestBooks: Book[] = [];
  authorBookCounts: { author: string; bookCount: number }[] = [];
  private chart: Chart | null = null;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    Chart.register(...registerables);
    setTimeout(() => {
      this.createChart();
    }, 100);
  }

  loadDashboardData(): void {
    this.bookService.getBooks().subscribe((books: Book[]) => {
      this.processLatestBooks(books);
      this.processOldestBooks(books);
      this.processAuthorData(books);

      if (this.chart) {
        this.chart.destroy();
        setTimeout(() => {
          this.createChart();
        }, 100);
      }
    });
  }

  private processLatestBooks(books: Book[]): void {
    this.latestBooks = books
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, 5);
  }

  private processOldestBooks(books: Book[]): void {
    this.oldestBooks = books
      .sort(
        (a, b) =>
          new Date(a.publicationDate).getTime() -
          new Date(b.publicationDate).getTime()
      )
      .slice(0, 10);
  }

  private processAuthorData(books: Book[]): void {
    const authorCounts = new Map<string, number>();

    books.forEach((book) => {
      const count = authorCounts.get(book.author) || 0;
      authorCounts.set(book.author, count + 1);
    });

    this.authorBookCounts = Array.from(authorCounts.entries()).map(
      ([author, bookCount]) => ({
        author,
        bookCount,
      })
    );
  }

  private createChart(): void {
    if (!this.chartRef?.nativeElement || this.authorBookCounts.length === 0)
      return;

    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = {
      labels: this.authorBookCounts.map((item) => item.author),
      datasets: [
        {
          data: this.authorBookCounts.map((item) => item.bookCount),
          backgroundColor: this.generateColors(this.authorBookCounts.length),
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }

  private generateColors(count: number): string[] {
    const colors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
      '#FF6384',
      '#C9CBCF',
      '#FF5733',
      '#33FF57',
      '#3357FF',
      '#F333FF',
    ];
    return colors.slice(0, count);
  }

  getChartColor(index: number): string {
    return this.generateColors(this.authorBookCounts.length)[index];
  }
}
