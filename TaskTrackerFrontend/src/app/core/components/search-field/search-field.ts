import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-field',
  imports: [FormsModule],
  templateUrl: './search-field.html',
  styleUrl: './search-field.scss',
})
export class SearchField {
  searchTerm = '';
  searchChanged = output<string>();

  onSearchChange(): void {
    this.searchChanged.emit(this.searchTerm);
  }
}
