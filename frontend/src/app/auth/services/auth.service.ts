import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { LoginResponse } from '../dto/login-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) {}

  login(data: Record<string, any>) {
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/api/login`,
      data,
      {
        withCredentials: true,
      }
    );
  }

  logout() {
    return this.http.post(
      `${environment.apiUrl}/api/logout`,
      {},
      {
        withCredentials: true
      }
    );
  }
}
