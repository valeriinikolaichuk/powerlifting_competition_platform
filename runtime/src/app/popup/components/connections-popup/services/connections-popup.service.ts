import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConnectionsPopupService {
  getBrowserName(userAgent: string): string {

    if (userAgent.includes('Edg/')) {
      return 'Edge';
    }

    if (userAgent.includes('OPR/') || userAgent.includes('Opera')) {
      return 'Opera';
    }

    if (userAgent.includes('Chrome/')) {
      return 'Chrome';
    }

    if (userAgent.includes('Firefox/')) {
      return 'Firefox';
    }

    if (userAgent.includes('Safari/') &&
        !userAgent.includes('Chrome/')) {
      return 'Safari';
    }

    return 'Unknown';
  }
}
