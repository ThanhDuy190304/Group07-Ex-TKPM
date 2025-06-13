import { useTranslation } from 'react-i18next';

export function useLang() {
    const { i18n } = useTranslation();
    return i18n.language;
}

export function useMultiTranslation() {
    const { t: tClass } = useTranslation('class');
    const { t: tClassRegistration } = useTranslation('classRegistration');
    const { t: tClassRegistrationPeriod } = useTranslation('classRegistrationPeriod');
    const { t: tCommon } = useTranslation('common');
    const { t: tStudent } = useTranslation('student');
    const { t: tFaculty } = useTranslation('faculty');
    const { t: tProgram } = useTranslation('program');

    return { tClass, tClassRegistration, tClassRegistrationPeriod, tStudent, tFaculty, tProgram, tCommon };
}