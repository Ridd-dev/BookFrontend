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

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe((data) => (this.books = data));
  }

  submitForm() {
    if (this.editMode && this.selectedId != null) {
      this.bookService
        .updateBook(this.selectedId, this.formData)
        .subscribe(() => {
          this.loadBooks();
          this.resetForm();
        });
    } else {
      this.bookService.addBook(this.formData).subscribe(() => {
        this.loadBooks();
        this.resetForm();
      });
    }
  }

  edit(book: Book) {
    this.formData = { ...book };
    this.selectedId = book.id!;
    this.editMode = true;
  }

  delete(id: number | undefined) {
    if (id) this.bookService.deleteBook(id).subscribe(() => this.loadBooks());
  }

  resetForm() {
    this.formData = { title: '', author: '', isbn: '', publicationDate: '' };
    this.editMode = false;
    this.selectedId = null;
  }
}
