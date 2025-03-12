import { useState } from "react";
import { Link } from 'react-router-dom';
import {
    Cog8ToothIcon, BellIcon, AcademicCapIcon, ArrowLeftIcon, ArrowRightIcon,
    UserCircleIcon
} from "@heroicons/react/24/outline";
function SidebarItem({ to, icon: Icon, label }) {
    return (
        <Link
            to={to}
            className="flex items-center gap-2 py-3 rounded-md hover:bg-gray-700 focus:bg-gray-700 group"
        >
            <Icon className="w-6 h-6 text-gray-500 group-hover:text-white group-focus:text-white" />
            <span className="text-sm text-gray-500 group-hover:text-white group-focus:text-white  select-none">{label}</span>
        </Link>
    )
}
function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="positive top-0 left-0">
            {/* Sidebar */}
            <div className={`h-screen bg-black transition-all duration-500
                ${isOpen ? "translate-x-0 visible opacity-100 w-64 p-4" : "-translate-x-full opacity-0 invisible w-0"}
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
                    <SidebarItem to="/" icon={AcademicCapIcon} label="Sinh viên" />
                    <SidebarItem to="/notification" icon={BellIcon} label="Thông báo" />
                    <SidebarItem to="/settings" icon={Cog8ToothIcon} label="Cài đặt" />
                </div>
            </div>

            {/* Button hiển thị sidebar */}
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