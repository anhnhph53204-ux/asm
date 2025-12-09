import { Component } from '@angular/core';
import { ItemComponent } from "../../component/item/item";
import { CommonModule } from '@angular/common';
import { IProduct } from '../../interface/product';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  imports: [ItemComponent,CommonModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class SearchComponent {
  keyword = '';
  products: IProduct[] =[];

  constructor(private router: ActivatedRoute, private http: HttpClient){}
  ngOnInit(): void{
    this.router.queryParams.subscribe(params =>{
      this.keyword = params['q'] || '';
      if(this.keyword){
        const url = `http://localhost:3000/products?name_like=${this.keyword}`;
        this.http.get<IProduct[]>(url).subscribe(data => {
          this.products = data;
        });
      }
    })
  }
}
