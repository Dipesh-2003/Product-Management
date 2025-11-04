import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../service/product';
import { Category } from '../../models/category.model'; 
import { CategoryService } from '../../service/category.service'; 

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
})
export class ProductList implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  private categoryMap = new Map<number, string>();

  currentPage = 0;
  pageSize = 5;
  totalPages = 0;

  productStatusTab: 'active' | 'inactive' = 'active';
  selectedCategoryId: 'all' | number = 'all';
  isDropdownOpen = false;

constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private elementRef: ElementRef
  ) {}

   @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }
    toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngOnInit(): void {
    this.loadCategoriesAndProducts();
  }

  loadCategoriesAndProducts(): void {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats;
      this.categoryMap = new Map(cats.map(cat => [cat.id, cat.name]));
      this.loadProducts();
    });
  }

  loadProducts(): void {
    const productLoader = 
      this.selectedCategoryId === 'all'
        ? this.productService.getProducts(this.currentPage, this.pageSize)
        : this.productService.getProductsByCategory(this.selectedCategoryId, this.currentPage, this.pageSize);

    productLoader.subscribe(data => {
      this.products = data.content;
      this.currentPage = data.number;
      this.totalPages = data.totalPages;
    });
  }

  loadInactiveProducts(): void {
    this.productService.getInactiveProducts(this.currentPage, this.pageSize).subscribe(data => {
      this.products = data.content;
      this.currentPage = data.number;
      this.totalPages = data.totalPages;
    });
  }

  selectStatusTab(tab: 'active' | 'inactive'): void {
    if (this.productStatusTab === tab) return; 
    this.productStatusTab = tab;
    this.resetAndLoad();
  }

  selectCategory(categoryId: 'all' | number): void {
    if (this.selectedCategoryId === categoryId) return; 
    this.selectedCategoryId = categoryId;
    this.resetAndLoad();
  }

  private resetAndLoad(): void {
    this.currentPage = 0;
    this.products = [];
    if (this.productStatusTab === 'active') {
      this.loadProducts();
    } else {
      this.loadInactiveProducts();
    }
  }

  getCategoryName(categoryId: number | undefined): string {
    return categoryId ? this.categoryMap.get(categoryId) || 'N/A' : 'N/A';
  }


  deactivateProduct(id: number): void {
    if (confirm('Are you sure you want to deactivate this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  restoreProduct(id: number): void {
    if (confirm('Are you sure you want to restore this product?')) {
      this.productService.restoreProduct(id).subscribe(() => {
        this.loadInactiveProducts();
      });
    }
  }

  permanentDeleteProduct(id: number): void {
    if (confirm('DANGER: This action is irreversible. Are you sure you want to permanently delete this product?')) {
      this.productService.permanentDelete(id).subscribe(() => {
        this.loadInactiveProducts();
      });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.productStatusTab === 'active' ? this.loadProducts() : this.loadInactiveProducts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.productStatusTab === 'active' ? this.loadProducts() : this.loadInactiveProducts();
    }
  }

  downloadCsv(): void {
  this.productService.downloadProductsAsCsv().subscribe(blob => {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = 'products.csv';
    a.click();
        URL.revokeObjectURL(objectUrl);
  });
   this.isDropdownOpen = false;
}

downloadExcel(): void {
  this.productService.downloadProductsAsExcel().subscribe(blob => {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = 'products.xlsx';
    a.click();
    URL.revokeObjectURL(objectUrl);
  });
   this.isDropdownOpen = false;
}

downloadPdf(): void {
  this.productService.downloadProductsAsPdf().subscribe(blob => {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = 'products.pdf'; 
    a.click();
    URL.revokeObjectURL(objectUrl);
  });
  this.isDropdownOpen = false; 
}
}