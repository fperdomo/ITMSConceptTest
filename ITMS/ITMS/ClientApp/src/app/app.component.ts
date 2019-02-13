import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showCompanies = true;
  title = 'app';

  toggleCompanies() { this.showCompanies = !this.showCompanies; }
}
