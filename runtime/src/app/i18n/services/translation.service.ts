import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type Lang = 'en' | 'uk' | 'pl';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  
  constructor(private http: HttpClient) {
    this.initializeLanguage();
  }

  lang = signal<Lang>('en');
  loadedScopes = signal<string[]>([]);

  translations = signal<
    Record<Lang, 
      Record<string, 
        Record<string, string>>>
    >({} as Record<Lang, Record<string, Record<string, string>>>);

  hasScope = computed(() => {
    const lang = this.lang();
    return (scope: string) => {
      return !!this.translations()[lang]?.[scope];
    };
  });

  private initializeLanguage(): void {

    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');

    if (lang === 'en' || lang === 'uk' || lang === 'pl') {
      this.lang.set(lang);
    }

    window.history.replaceState(
      {},
      '',
      window.location.pathname
    );
  }

  load(scope: string) {

    if (!this.loadedScopes().includes(scope)) {
      this.loadedScopes.update(scopes => [
        ...scopes,
        scope
      ]);
    }

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
  }

  t(scope: string, key: string): string {

    const lang = this.lang();

    return this.translations()[lang]?.[scope]?.[key] ?? key;
  }
}
