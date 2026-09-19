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

  waitForConnection(timeout = 5000): Promise<void> {

    if (this.socket.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {

      const timer = setTimeout(() => {
        this.socket.off('connect', onConnect);
        reject(new Error('Socket connection timeout'));
      }, timeout);

      const onConnect = () => {
        clearTimeout(timer);
        resolve();
      };

      this.socket.once('connect', onConnect);
    });
  }
}
