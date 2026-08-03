import { Component } from '@angular/core';
import { TranslatePipe } from '../../i18n/pipes/translate.pipe';
import { TranslationService } from '../../i18n/services/translation.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-role.component',
  imports: [TranslatePipe],
  templateUrl: './role.component.html',
})
export class RoleComponent {

  constructor(
    public tService: TranslationService
  ){}

  ngOnInit(){
    this.tService.load('pages/role');
  }

  async return(): Promise<void> {
    window.location.href = `${environment.frontendUrl}/mode`;
  }
}
