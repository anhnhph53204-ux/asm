import { CommonModule, NgIf,  } from '@angular/common';
import { Component, Input,  } from '@angular/core';
import { RouterLink } from "@angular/router";
export interface Product {
  id: number;
  name: string;
  rating: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  image?: string;
}
@Component({
  selector: 'app-item',
  standalone: true,
  imports: [RouterLink, CommonModule, NgIf],
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class ItemComponent {
  @Input() product!: Product;
  getStar(): string{
    const full = Math.floor(this.product.rating)
    const half = this.product.rating % 1 !== 0
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - Math.ceil(this.product.rating));
  }
}
