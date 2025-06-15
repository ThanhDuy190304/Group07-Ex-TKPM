import i18n from "../config/i18n";

export function getErrorMessage(error: any) {
    const lang = i18n.language;
    const data = error.response.data ?? {};
    return lang === "en" ? data.error : data.error_vn;
}