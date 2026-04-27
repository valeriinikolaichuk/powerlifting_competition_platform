import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  login = '';
  password = '';
  language = 'en';

  onSubmit() {
    console.log(this.login, this.password, this.language);
  }
}
