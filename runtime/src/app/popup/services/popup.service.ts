import { Injectable, signal, Type } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PopupService {
    component = signal<Type<any> | null>(null);
    data = signal<any>(null);

    private resolve?: (value: any) => void;

    open<T = void>(
        component: Type<any>,
        data?: any,
    ): Promise<T> {
        this.component.set(component);
        this.data.set(data ?? null);

        return new Promise<T>((resolve) => {
            this.resolve = resolve;
        });
    }

    close<T = void>(result?: T): void {
        this.component.set(null);
        this.data.set(null);

        this.resolve?.(result as T);
        this.resolve = undefined;
    }
}
