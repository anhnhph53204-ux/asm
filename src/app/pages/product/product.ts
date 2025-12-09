import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../interface/product';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product',
  imports: [CommonModule, RouterLink],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class ProductComponent implements OnInit {
  products : IProduct[] = [];

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.http.get<IProduct[]>('http://localhost:3000/products')
    .subscribe(data =>this.products = data)
  }

}
