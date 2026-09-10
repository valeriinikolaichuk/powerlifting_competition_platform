import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  
  public socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl);
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
