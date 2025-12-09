import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from "@angular/router";
import { ItemComponent, type Product } from "../../component/item/item";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule,RouterLink, ItemComponent, FormsModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class CategoryComponent implements OnInit {
  categoryId!: number;
  categoryName = 'Casual';
  currentPage = 1;
  itemsPerPage = 9;
  totalProducts = 0;
  sortBy = 'popular';
  selectedSize = 'Large';
  selectedColors: number[] = [1, 2, 3];
  priceRange = { min: 50, max: 200 };
  categories = ['T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans'];
  dressStyles = ['Casual', 'Formal', 'Party', 'Gym'];
  sizes = ['XX-Small', 'X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'];
  availableColors = [
    { name: 'Red', value: '#FF0000' },
    { name: 'Yellow', value: '#FFFF00' },
    { name: 'Green', value: '#00FF00' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Orange', value: '#FFA500' },
    { name: 'Purple', value: '#800080' },
    { name: 'Pink', value: '#FFC0CB' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' }
  ];
    allProducts: Product[] = []
  displayedProducts: Product[] = [];
  constructor(private route: ActivatedRoute,
    private http: HttpClient
  ) {}

    ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['sale']) {
        this.categoryName = 'On Sale';
      } else if (params['new']) {
        this.categoryName = 'New Arrivals';
      }
    });

    this.route.paramMap.subscribe(params =>{
      const id = params.get('id');
      if(id) {
        this.categoryId = Number(id);
        this.getProductsByCategory(this.categoryId);
      }else{
        this.getAllProducts();
      }
    });
  }

  getAllProducts(){
    this.http.get<Product[]>('http://localhost:3000/products')
    .subscribe(data =>{
      this.allProducts = data;
      this.totalProducts = data.length;
      this.updateDisplayedProducts()
    })
  }

  getProductsByCategory(categoryId: number) {
    fetch(`http://localhost:3000/products?categoryId=${categoryId}`)
      .then(res => res.json())
      .then((data: Product[]) => {
        this.allProducts = data;
        this.totalProducts = data.length;
        this.updateDisplayedProducts();
      });
  }
    get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
    get endIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalProducts);
  }

  get totalPages(): number {
    return Math.ceil(this.totalProducts / this.itemsPerPage);
  }
  get visiblePages(): number[]{
    const pages: number[] = [];
    const total = this.totalPages;
    if (total <= 10) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    }else {
      pages.push(1);
      if (this.currentPage > 3) pages.push(-1); // ... indicator
      
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(total - 1, this.currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (this.currentPage < total - 2) pages.push(-1);
      pages.push(total);
    }
    return pages;
  }
    toggleColor(index: number) {
    const idx = this.selectedColors.indexOf(index);
    if (idx > -1) {
      this.selectedColors.splice(idx, 1);
    } else {
      this.selectedColors.push(index);
    }
  }
    applyFilters() {
    this.currentPage = 1;
    this.updateDisplayedProducts();
  }

    applySort() {
    this.updateDisplayedProducts();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== -1) {
      this.currentPage = page;
      this.updateDisplayedProducts();
    }
  }
    updateDisplayedProducts() {
    let products = [...this.allProducts];
        switch (this.sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        products.sort((a, b) => b.id - a.id);
        break;
      default: // popular
        products.sort((a, b) => b.rating - a.rating);
    }
        const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedProducts = products.slice(start, end);
  }
}

