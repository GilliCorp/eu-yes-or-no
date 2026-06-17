/** Minimal UI string table. Page-chrome text lives here; content lives in dossiers. */
export const languages = { is: 'Íslenska', en: 'English' } as const;

export type Lang = keyof typeof languages;

export const ui = {
  is: {
    'site.title': 'ESB — já eða nei?',
    'site.tagline': 'Hvað myndum við græða og hvað myndum við tapa? Á mannamáli, með heimildum.',
    'home.chapters': 'Kaflar',
    'home.lastReviewed': 'Síðast yfirfarið',
    'home.draft': 'Vinnueintak — heimildastutt en óyfirlesið.',
  },
  en: {
    'site.title': 'EU — yes or no?',
    'site.tagline': 'What would we gain and what would we lose? In plain language, with sources.',
    'home.chapters': 'Chapters',
    'home.lastReviewed': 'Last reviewed',
    'home.draft': 'Work in progress — sourced but not yet copy-edited.',
  },
} as const;

export function t(lang: Lang, key: keyof (typeof ui)['is']): string {
  return ui[lang][key];
}
