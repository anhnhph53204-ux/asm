import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IProduct } from '../../interface/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class Cart {
  promoCode = '';
  cartItems: (IProduct & { quantity?: number })[] = [];

  ngOnInit() {
    const saved = localStorage.getItem('cart');
    this.cartItems = saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  get subtotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
  }

  get discount(): number {
    return Math.round(this.subtotal * 0.2);
  }

  get deliveryFee(): number {
    return 15;
  }

  get total(): number {
    return this.subtotal - this.discount + this.deliveryFee;
  }

  removeItem(id: number) {
    this.cartItems = this.cartItems.filter((item) => item.id !== id);
    this.saveCart();
  }

  increaseQuantity(id: number) {
    const item = this.cartItems.find((i) => i.id === id);
    if (item) {
      item.quantity = (item.quantity || 1) + 1;
      this.saveCart();
    }
  }

  decreaseQuantity(id: number) {
    const item = this.cartItems.find((i) => i.id === id);
    if (item && (item.quantity || 1) > 1) {
      item.quantity!--;
      this.saveCart();
    }
  }

  applyPromo() {
    console.log('Applying promo code:', this.promoCode);
  }
}
