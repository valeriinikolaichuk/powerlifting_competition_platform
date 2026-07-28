import { Component, inject, ViewChild, ElementRef, effect, Injector, } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { PopupService } from '../services/popup.service';
import { POPUP_DATA } from '../shared/tokens/popup-data.token';

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

  
  dialogEffect = effect(() => {
      const cmp = this.component();

      if (!this.dialogRef) return;

      if (cmp) {
        this.dialogRef.nativeElement.showModal();
      } else {
        this.dialogRef.nativeElement.close();
      }
    });
  

  customInjector = () =>
    Injector.create({
      providers: [
        {
          provide: POPUP_DATA,
          useValue: this.popup.data(),
        },
      ],
    });
}
