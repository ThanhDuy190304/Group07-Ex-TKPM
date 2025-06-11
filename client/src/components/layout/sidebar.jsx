import { useState } from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
    Cog8ToothIcon, BellIcon, AcademicCapIcon, ArrowLeftIcon, ArrowRightIcon,
    UserCircleIcon, ClipboardIcon, ClipboardDocumentIcon
} from "@heroicons/react/24/outline";
function SidebarItem({ to, icon: Icon, label }) {
    return (
        <Link
            to={to}
            className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-700 focus:bg-gray-700 group"
        >
            <Icon className="w-6 h-6 text-gray-500 group-hover:text-white group-focus:text-white" />
            <span className="text-sm text-gray-500 group-hover:text-white group-focus:text-white  select-none">{label}</span>
        </Link>
    )
}
function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const { i18n } = useTranslation();
    const language = i18n.language;

    // Tên theo ngôn ngữ
    const text = {
        student: language === "en" ? "Student" : "Sinh viên",
        notification: language === "en" ? "Notifications" : "Thông báo",
        setting: language === "en" ? "Settings" : "Cài đặt",
        facultyProgram: language === "en" ? "Faculties & Programs" : "Khoa và Chương Trình Học",
        course: language === "en" ? "Courses" : "Khóa học",
    };

    return (
        <div className="positive top-0 left-0">
            {/* Sidebar */}
            <div className={`h-screen bg-black transition-all duration-500
                ${isOpen ? "translate-x-0 visible opacity-100 w-72 p-4" : "-translate-x-full opacity-0 invisible w-0"}
            `}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <UserCircleIcon className="w-8 h-8 text-white" />
                        <span className="text-white text-xl">Admin</span>
                    </div>
                    <ArrowLeftIcon
                        onClick={() => setIsOpen(false)}
                        className="w-7 h-7 text-white cursor-pointer"
                    />
                </div>
                <div className="flex flex-col gap-2 bg-black mt-8">
                    <SidebarItem to="/" icon={AcademicCapIcon} label={text.student} />
                    <SidebarItem to="/notification" icon={BellIcon} label={text.notification} />
                    <SidebarItem to="/setting" icon={Cog8ToothIcon} label={text.setting} />
                    <SidebarItem to="/faculties-and-programs" icon={ClipboardIcon} label={text.facultyProgram} />
                    <SidebarItem to="/courses" icon={ClipboardDocumentIcon} label={text.course} />
                </div>
            </div>

            {/* Nút hiện sidebar */}
            {!isOpen && (
                <ArrowRightIcon
                    onClick={() => setIsOpen(true)}
                    className="fixed top-4 h-8 w-8 transition-all duration-800 cursor-pointer"
                />
            )}
        </div>
    );
}


export default Sidebar;