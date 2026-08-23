import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LanTokenService {

  constructor(
    private readonly http: HttpClient,
  ) {}

  ensureToken(): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}/api/auth/lan-token`,
      {},
      {
        withCredentials: true,
      },
    );
  }
}
