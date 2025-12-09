import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  categoryId: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private readonly categoryApi = 'http://localhost:3000/categories';
  private readonly productApi = 'http://localhost:3000/products';

  categories: Category[] = [];
  products: Product[] = [];

  editCategoryId: number | null = null;
  editProductId: number | null = null;
  loadingCategories = false;
  loadingProducts = false;
  errorMessage = '';

  categoryFrm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
  });

  productFrm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    image: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    price: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    categoryId: new FormControl<number | null>(null, { validators: [Validators.required] }),
  });

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.http
      .get<Category[]>(this.categoryApi)
      .pipe(finalize(() => (this.loadingCategories = false)))
      .subscribe({
        next: (data) => {
          this.categories = data;
          this.errorMessage = '';
        },
        error: () => (this.errorMessage = 'Không thể tải danh mục, vui lòng kiểm tra JSON server.'),
      });
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.http
      .get<Product[]>(this.productApi)
      .pipe(finalize(() => (this.loadingProducts = false)))
      .subscribe({
        next: (data) => {
          this.products = data;
          this.errorMessage = '';
        },
        error: () => (this.errorMessage = 'Không thể tải sản phẩm, vui lòng kiểm tra JSON server.'),
      });
  }

  submitCategory(): void {
    if (this.categoryFrm.invalid) {
      this.categoryFrm.markAllAsTouched();
      return;
    }

    const payload = { name: this.categoryFrm.value.name?.trim() };

    if (this.editCategoryId) {
      this.http.put(`${this.categoryApi}/${this.editCategoryId}`, { id: this.editCategoryId, ...payload }).subscribe(() => {
        this.resetCategoryForm();
        this.loadCategories();
      });
      return;
    }

    this.http.post(this.categoryApi, payload).subscribe(() => {
      this.resetCategoryForm();
      this.loadCategories();
    });
  }

  editCategory(category: Category): void {
    this.editCategoryId = category.id;
    this.categoryFrm.patchValue({ name: category.name });
  }

  deleteCategory(id: number): void {
    if (!confirm('Xóa danh mục này?')) {
      return;
    }

    this.http.delete(`${this.categoryApi}/${id}`).subscribe(() => {
      this.loadCategories();
      if (this.editCategoryId === id) {
        this.resetCategoryForm();
      }
    });
  }

  submitProduct(): void {
    if (this.productFrm.invalid) {
      this.productFrm.markAllAsTouched();
      return;
    }

    const payload = {
      name: this.productFrm.value.name?.trim(),
      image: this.productFrm.value.image,
      price: this.productFrm.value.price,
      categoryId: Number(this.productFrm.value.categoryId),
    };

    if (this.editProductId) {
      this.http.put(`${this.productApi}/${this.editProductId}`, { id: this.editProductId, ...payload }).subscribe(() => {
        this.resetProductForm();
        this.loadProducts();
      });
      return;
    }

    this.http.post(this.productApi, payload).subscribe(() => {
      this.resetProductForm();
      this.loadProducts();
    });
  }

  editProduct(product: Product): void {
    this.editProductId = product.id;
    this.productFrm.patchValue({
      name: product.name,
      image: product.image,
      price: product.price,
      categoryId: product.categoryId,
    });
  }

  deleteProduct(id: number): void {
    if (!confirm('Xóa sản phẩm này?')) {
      return;
    }

    this.http.delete(`${this.productApi}/${id}`).subscribe(() => {
      this.loadProducts();
      if (this.editProductId === id) {
        this.resetProductForm();
      }
    });
  }

  cancelCategoryEdit(): void {
    this.resetCategoryForm();
  }

  cancelProductEdit(): void {
    this.resetProductForm();
  }

  trackById(_: number, item: { id: number }): number {
    return item.id;
  }

  getCategoryName(id: number): string {
    const cate = this.categories.find((c) => c.id === id);
    return cate ? cate.name : '';
  }

  private resetCategoryForm(): void {
    this.editCategoryId = null;
    this.categoryFrm.reset({ name: '' });
  }

  private resetProductForm(): void {
    this.editProductId = null;
    this.productFrm.reset({
      name: '',
      image: '',
      price: 0,
      categoryId: null,
    });
  }
}
