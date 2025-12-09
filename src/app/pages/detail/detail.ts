import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { IProduct } from '../../interface/product';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.html',
  styleUrls: ['./detail.css'],
})
export class DetailComponent implements OnInit {
  productId!: number;
  product: IProduct | null = null;

  constructor(private route: ActivatedRoute,
    private http: HttpClient
  ) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = Number(id);
        this.getProductById(this.productId);
      }
    })
  }
  getProductById(productId: number) {
    this.http.get(`http://localhost:3000/products/${productId}`)
      .subscribe({
        next: (data) => {
          if (!data || Object.keys(data).length === 0) {
            this.product = null;
            return;
          }
          this.product = data as IProduct;
        },
        error: (err) => {
          console.error('Error fetching product:', err);
          this.product = null;
        }
      })

  }

  addToCart(){
    if(!this.product) return;
    let cart = JSON.parse(localStorage.getItem('cart') || '[]') as (IProduct & { quantity?: number })[];
    cart.push(this.product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart successfully!');
  }
}

