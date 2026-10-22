import { Injectable } from '@angular/core';
import { PGlite } from '@electric-sql/pglite';

import { PgliteService } from '../../database/services/pglite.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CheckOnlineService {
      
  private pg!: PGlite;
  
  constructor(
    private readonly pgliteService: PgliteService,
    private readonly userService: UserService,
  ) {
    this.pg = this.pgliteService.database;
  }

  async checkOnline(): Promise<boolean> {

    const userId = await this.userService.getUserId();
    
    const result = await this.pg.query(
      `
        SELECT mode 
        FROM device_status 
        WHERE created_by_user_id = $1
          AND device_role = 'ADMIN'
          AND mode = 'ONLINE' 
          AND is_deleted = false
          LIMIT 1
      `,
      [userId]
    );

    return result.rows.length > 0;
  }
}
