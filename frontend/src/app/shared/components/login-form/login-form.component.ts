import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  onSubmit() {
    const loginData = {
      login: this.login,
      password: this.password,
      language: this.language,
    };

    this.http.post('/api/login', loginData, {
      withCredentials: true,
    }).subscribe({
      next: (res: any) => {
        this.checkAndRoute(res);
      },
      error: () => {
        console.error('error by path: /api/login');
      },
    });
  }

  checkAndRoute(json: any) {
    console.log('SERVER RESPONSE:', json);

    if (json.success) {
      alert('LOGIN SUCCESS');
      // тут потім буде router.navigate або popup.close()
    } else {
      alert('LOGIN FAILED');
    }
  }
}
