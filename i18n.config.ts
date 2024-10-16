import { english, spanish } from "~~/__locales/_index";

export default defineI18nConfig(() => (
    {
        fallbackLocale: 'en',
        legacy: false,
        locale: 'en',
        messages: {
            en: english,
            sp: spanish
        }
    }
));
