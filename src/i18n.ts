import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import frTranslation from './locales/fr/translation.json';
import enTranslation from './locales/en/translation.json';
import deTranslation from './locales/de/translation.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            fr: { translation: frTranslation },
            en: { translation: enTranslation },
            de: { translation: deTranslation },
        },
        lng: 'fr', // langue par défaut
        fallbackLng: 'fr',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
