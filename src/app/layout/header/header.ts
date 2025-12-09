
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule,FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent {
  showBanner = true;
  keyword= '';

  constructor(private router: Router){}
closeBanner(){
  this.showBanner = false;
}
onSearch(){
  const key = this.keyword.trim();
  if(key){
    this.router.navigate(['/search'], {queryParams:{q: key}});
    this.keyword = '';
  }
}
}
