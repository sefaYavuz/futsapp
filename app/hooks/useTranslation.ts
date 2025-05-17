import { nl } from '../i18n/translations';

type TranslationKey = keyof typeof nl;
type NestedKey<T> = T extends object ? { [K in keyof T]: NestedKey<T[K]> } : string;

export function useTranslation() {
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = nl;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return value as string;
  };

  return { t };
} 