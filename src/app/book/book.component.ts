import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book } from './book.model';
import { BookService } from './book.service';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  books: Book[] = [];
  formData: Book = { title: '', author: '', isbn: '', publicationDate: '' };
  editMode = false;
  selectedId: number | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.isLoading = false;
        console.log('Books loaded:', data);
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.errorMessage = 'Failed to load books. Please try again.';
        this.isLoading = false;
      },
    });
  }

  submitForm(): void {
    if (!this.isValidForm()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.editMode && this.selectedId != null) {
      this.bookService.updateBook(this.selectedId, this.formData).subscribe({
        next: () => {
          console.log('Book updated successfully');
          this.loadBooks();
          this.resetForm();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating book:', error);
          this.errorMessage = 'Failed to update book. Please try again.';
          this.isLoading = false;
        },
      });
    } else {
      this.bookService.addBook(this.formData).subscribe({
        next: (result) => {
          console.log('Book added successfully:', result);
          this.loadBooks();
          this.resetForm();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error adding book:', error);
          this.errorMessage = 'Failed to add book. Please try again.';
          this.isLoading = false;
        },
      });
    }
  }

  edit(book: Book): void {
    this.formData = { ...book };
    this.selectedId = book.id!;
    this.editMode = true;
    this.errorMessage = '';
  }

  delete(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this book?')) {
      this.isLoading = true;
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          console.log('Book deleted successfully');
          this.loadBooks();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting book:', error);
          this.errorMessage = 'Failed to delete book. Please try again.';
          this.isLoading = false;
        },
      });
    }
  }

  resetForm(): void {
    this.formData = { title: '', author: '', isbn: '', publicationDate: '' };
    this.editMode = false;
    this.selectedId = null;
    this.errorMessage = '';
  }

  private isValidForm(): boolean {
    return !!(
      this.formData.title?.trim() &&
      this.formData.author?.trim() &&
      this.formData.isbn?.trim() &&
      this.formData.publicationDate
    );
  }
}
