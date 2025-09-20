import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import frTranslation from './locales/fr/translation.json';
import enTranslation from './locales/en/translation.json';
import deTranslation from './locales/de/translation.json';
import itTranslation from './locales/it/translation.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            fr: { translation: frTranslation },
            en: { translation: enTranslation },
            de: { translation: deTranslation },
            it: { translation: itTranslation },
        },
        lng: 'fr',
        fallbackLng: 'fr',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
