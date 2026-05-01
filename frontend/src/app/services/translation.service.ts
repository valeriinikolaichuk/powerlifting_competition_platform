import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type Lang = 'en' | 'uk' | 'pl';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private http: HttpClient) {}
  
  lang = signal<Lang>('en');
  scope = signal<string>('home');

  translations = signal<
    Record<Lang, 
      Record<string, 
        Record<string, string>>>
    >({} as Record<Lang, Record<string, Record<string, string>>>);

  setLang(lang: Lang) {
    this.lang.set(lang);
  
    const scope = this.scope();
    this.load(scope);
  }

  load(scope: string) {
    const lang = this.lang();
    const current = this.translations();

    if (current[lang]?.[scope]) return;

    this.http
      .get<Record<string, string>>(`/assets/i18n/${scope}/${lang}.json`)
      .subscribe(data => {
        this.translations.set({
          ...current,
          [lang]: {
          ...(current[lang] ?? {}),
          [scope]: data,
        },
        });
      });

    this.scope.set(scope);
  }

  t(scope: string, key: string): string {
    const lang = this.lang();

    return this.translations()[lang]?.[scope]?.[key] ?? key;
  }
}
