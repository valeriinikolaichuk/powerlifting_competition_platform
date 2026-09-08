import { Injectable } from '@angular/core';
import { PgliteService } from '../../database/services/pglite.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  constructor(
    private readonly pgliteService: PgliteService,
  ) {}

  async getUserId(): Promise<string> {

    const result = await this.pgliteService.query<{ id: string }>(
      `
      SELECT id
      FROM users
      LIMIT 1
      `,
    );

    if (!result.rows[0]) {
      throw new Error('User not found.');
    }

    return result.rows[0].id;
  }
}
