import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../service/product';
import { HttpErrorResponse } from '@angular/common/http';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../service/category.service';
import { Observable, of } from 'rxjs';
import { map, switchMap, debounceTime, first } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css']
})
export class ProductForm implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  currentProductId: number | null = null;
  errorMessage: string | null = null;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required], [this.nameValidator()]],
      description: [''],
      categoryId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.currentProductId = +id;
      // this.productForm.get('productId')?.disable();
      this.productForm.addControl('productId', this.fb.control({ value: '', disabled: true }));
      
      this.productService.getProductById(this.currentProductId).subscribe(product => {
        this.productForm.patchValue(product);
      });
    }
  }

  //   productIdValidator(): AsyncValidatorFn {
  //   return (control: AbstractControl): Observable<ValidationErrors | null> => {
  //     if (this.isEditMode) {
  //       return of(null);
  //     }
  //     return control.valueChanges.pipe(
  //       debounceTime(300),
  //       switchMap(value => this.productService.checkProductIdExists(value)),
  //       map(exists => (exists ? { productIdExists: true } : null)),
  //       first() 
  //     );
  //   };
  // }

    nameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return control.valueChanges.pipe(
        debounceTime(300),
        switchMap(value => this.productService.checkNameExists(value, this.currentProductId)),
        map(exists => (exists ? { nameExists: true } : null)),
        first()
      );
    };
  }
   loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

 onSubmit(): void {
    if (this.productForm.invalid) {
     this.productForm.markAllAsTouched();

      return;
    }

    this.errorMessage = null;
    const productData = this.productForm.getRawValue();
    const handleError = (err: HttpErrorResponse) => {
      if (typeof err.error === 'string') {
        if (err.error.includes('Query did not return a unique result')) {
           this.errorMessage = 'Duplicate name is not allowed.';
        } else {
           this.errorMessage = err.error;
        }
      } else {
        this.errorMessage = `An unexpected error occurred. Status: ${err.status}`;
      }
    };

    if (this.isEditMode && this.currentProductId) {
      this.productService.updateProduct(this.currentProductId, productData).subscribe({
        next: () => this.router.navigate(['/products']),
        error: handleError 
      });
    } else {
      this.productService.addProduct(productData).subscribe({
        next: () => this.router.navigate(['/products']),
        error: handleError 
      });
    }
  }
}