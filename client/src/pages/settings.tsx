import { useTranslation } from 'react-i18next';
import { Select, Option } from '@mui/joy';

function SettingsPage() {
    const { i18n } = useTranslation();
    const lang = i18n.language;

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    return (
        <main className="flex flex-col gap-6 w-full p-6">
            <h2 className="text-3xl font-bold">
                {lang === 'en' ? 'Settings' : 'Cài đặt'}
            </h2>

            <section className="rounded-xl shadow-md border p-6 bg-white w-full">
                <div className="grid grid-cols-2 items-center gap-4 m-2">
                    <label className="text-lg font-medium">
                        {lang === 'en' ? 'Choose language:' : 'Chọn ngôn ngữ:'}
                    </label>

                    <Select
                        value={lang}
                        onChange={(_, value) => {
                            if (value) changeLanguage(value);
                        }}
                        className="min-w-32 max-w-80"
                    >
                        <Option value="en">🇺🇸 English</Option>
                        <Option value="vi">🇻🇳 Tiếng Việt</Option>
                    </Select>
                </div>
            </section>
        </main>
    );
}

export default SettingsPage;
