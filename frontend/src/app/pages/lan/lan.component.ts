import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lan',
  imports: [],
  templateUrl: './lan.component.html',
})
export class LanComponent {

  constructor(
    private readonly router: Router,
  ) {}

  async return(): Promise<void> {
    await this.router.navigate(['/mode']);
  }
}
