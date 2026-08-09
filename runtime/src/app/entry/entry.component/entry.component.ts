import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { EntryService } from '../services/entry.service';

@Component({
  selector: 'app-entry.component',
  standalone: true,
  imports: [],
  templateUrl: './entry.component.html',
})
export class EntryComponent implements OnInit {

  adminExists = false;

  constructor(
    private readonly entryService: EntryService,
  ) {}

  async ngOnInit(): Promise<void> {

    await this.entryService.check();

  }


  
//      const deviceId = crypto.randomUUID();
/*
      const response = await firstValueFrom(
        this.http.post<ConnectionCheckResponse>(
          '/api/connections/admin',
          {
            lang,
            device_id: deviceId,
          },
        ),
      );

      this.adminExists = response.adminExists;
    }
  */
}
