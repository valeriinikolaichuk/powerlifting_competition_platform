import { Component, inject, ViewChild, ElementRef, effect, Injector, } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { PopupService } from '../services/popup.service';
import { POPUP_DATA } from '../tokens/popup-data.token';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './popup.component.html',
})
export class PopupComponent {

  popup = inject(PopupService);

  @ViewChild('dialog') dialogRef!: ElementRef<HTMLDialogElement>;

  component = this.popup.component;
  data = this.popup.data;

  customInjector!: Injector;

  dialogEffect = effect(() => {

    const cmp = this.component();
    const data = this.data();

    if (!this.dialogRef) return;

    if (cmp) {

      this.customInjector = Injector.create({
        providers: [
          {
            provide: POPUP_DATA,
            useValue: data,
          },
        ],
      });

      this.dialogRef.nativeElement.showModal();

    } else {

      this.dialogRef.nativeElement.close();

    }
  });
}
