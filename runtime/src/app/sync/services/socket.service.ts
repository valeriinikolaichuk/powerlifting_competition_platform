import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  
  public socket: Socket;

  constructor() {
    const deviceId = localStorage.getItem('device_id');

    this.socket = io(environment.apiUrl, {
      query: {
        deviceId,
      },
    });
  }

  waitForConnection(): Promise<void> {

    if (this.socket.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.socket.once('connect', () => {
        resolve();
      });
    });
  }
}
