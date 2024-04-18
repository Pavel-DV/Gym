'use strict';

const lang = (navigator.language === 'en-US' || navigator.language === 'en-us') ? 'en' : 'ru';

const i18n = Object.fromEntries([
    {
        name: 'Gym', translates: {
            en: 'Gym',
            ru: 'Качалка',
        },
    },
    {
        name: 'Home',
        translates: {
            en: 'Home',
            ru: 'Начало',
        },
    },
    {
        name: 'Refresh',
        translates: {
            en: 'Refresh',
            ru: 'Обновить',
        },
    },
    {
        name: 'EditData',
        translates: {
            en: 'Data',
            ru: 'Исходные данные',
        },
    },
    {
        name: 'Delete',
        translates: {
            en: 'Delete',
            ru: 'Удалить',
        },
    },
    {
        name: 'ExerciseName',
        translates: {
            en: 'Name',
            ru: 'Название',
        },
    },
    {
        name: 'ExerciseNotes',
        translates: {
            en: 'Notes',
            ru: 'Заметки',
        },
    },
    {
        name: 'Period',
        translates: {
            en: 'Period (days)',
            ru: 'Периодичность (дней)',
        },
    },
    {
        name: 'daysAgo',
        translates: {
            en: 'd. ago',
            ru: 'д. назад',
        },
    },
    {
        name: 'Add',
        translates: {
            en: 'Add',
            ru: 'Добавить',
        },
    },
].map(function (string) {
    return [ string.name, string.translates[this] ]
}, lang));

export default function (word) {
    return i18n[word];
}
