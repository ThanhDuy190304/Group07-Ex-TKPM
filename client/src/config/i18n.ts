import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import studentVi from '../locales/vi/student';
import facultyVi from '../locales/vi/faculty';
import programVi from '../locales/vi/program';
import courseVi from '../locales/vi/course';
import commonVi from '../locales/vi/common';

import studentEn from '../locales/en/student';
import facultyEn from '../locales/en/faculty';
import programEn from '../locales/en/program';
import courseEn from '../locales/en/course';
import commonEn from '../locales/en/common';


i18n
    .use(initReactI18next)
    .init({
        lng: 'en', // ngôn ngữ mặc định
        fallbackLng: 'vi',
        debug: true,
        ns: ['student', 'faculty', 'program', 'course'],
        resources: {
            vi: {
                student: studentVi,
                faculty: facultyVi,
                program: programVi,
                course: courseVi,
                common: commonVi,
            },
            en: {
                student: studentEn,
                faculty: facultyEn,
                program: programEn,
                course: courseEn,
                common: commonEn
            },
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
