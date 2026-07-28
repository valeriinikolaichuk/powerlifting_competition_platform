import { Injectable, signal, Type } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PopupService {
    component = signal<Type<any> | null>(null);
    data = signal<any>(null);

    open(component: Type<any>, data?: any) {
        this.component.set(component);
        this.data.set(data ?? null);
    }

    close() {
        this.component.set(null);
        this.data.set(null);
    }
}
