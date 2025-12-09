import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ItemComponent } from '../../component/item/item';
import  { HttpClient } from '@angular/common/http';
import { IProduct } from '../../interface/product';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ItemComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent  {
products: IProduct[] = [];
constructor(private http: HttpClient){}
  ngOnInit(){
    this.http.get<IProduct[]>(`http://localhost:3000/products`)
    .subscribe(data =>{
      this.products = data;
    })
  }
}
