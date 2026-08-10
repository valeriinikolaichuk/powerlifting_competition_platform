import { Component } from '@angular/core';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../i18n/services/translation.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './admin.component.html'
})
export class AdminComponent {

  constructor(
    public tService: TranslationService
  ){}

  ngOnInit(){
    this.tService.load('pages/role');
  }

  backToMode(): void {
    window.location.href = `${environment.frontendUrl}/mode`;
  }
}
