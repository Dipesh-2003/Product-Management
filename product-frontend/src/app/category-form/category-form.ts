import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Category } from '../models/category.model';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrls: ['./category-form.css'],
})
export class CategoryForm implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  errorMessage: string | null = null;
  
  isEditMode = false;
  currentCategoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }
    this.errorMessage = null;
    const categoryData = this.categoryForm.value;

    if (this.isEditMode && this.currentCategoryId) {
      this.categoryService.updateCategory(this.currentCategoryId, categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.cancelEdit();
        },
        error: this.handleError
      });
    } else {
      this.categoryService.addCategory(categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.categoryForm.reset();
        },
        error: this.handleError
      });
    }
  }

  startEdit(category: Category): void {
    this.isEditMode = true;
    this.currentCategoryId = category.id;
    this.categoryForm.patchValue({ name: category.name });
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.currentCategoryId = null;
    this.categoryForm.reset();
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category? This cannot be undone.')) {
      this.errorMessage = null;
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: this.handleError
      });
    }
  }

  // Central error handling function
  private handleError = (err: HttpErrorResponse) => {
    if (typeof err.error === 'string') {
      this.errorMessage = err.error;
    } else {
      this.errorMessage = err.error?.message || 'A server error occurred.';
    }
  }
}