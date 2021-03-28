'use strict';

const lang = (navigator.language === 'en-US' || navigator.language === 'en-us') ? 'en' : 'ru';

export const i18n = Object.fromEntries([
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
            ru: 'В начало',
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
            en: 'Exercise name',
            ru: 'Название упражнения',
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
            en: 'Add New',
            ru: 'Добавить новое',
        },
    },
].map(function (string) {
    return [ string.name, string.translates[this] ]
}, lang));
