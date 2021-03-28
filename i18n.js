'use strict';

const lang = navigator.language === 'en-US' ? 'en' : 'ru';

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
        name: 'EditData',
        translates: {
            en: 'Data Edit',
            ru: 'Редактирование данных',
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
].map(function (string) {
    return [ string.name, string.translates[this] ]
}, lang));
