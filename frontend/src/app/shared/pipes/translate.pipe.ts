import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Pipe({
  name: 't',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  t = inject(TranslationService);

  transform(key: string, scope: string): string {
    return this.t.t(scope, key);
  }
}
