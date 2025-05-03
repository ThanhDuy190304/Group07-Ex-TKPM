import React, { useState } from 'react'

export default function ToggleOnOff({ isOn, onToggle }: { isOn: boolean; onToggle: () => Promise<void> }) {
    const [isChecked, setIsChecked] = useState(isOn);
    const handleCheckboxChange = async () => {
        await onToggle();
        setIsChecked(!isChecked)
    }
    return (
        <label className="flex cursor-pointer select-none items-center">
            <div className="relative">
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="sr-only"
                />
                <div
                    className={`box block h-5 w-10 rounded-full transition-colors duration-300 ${isChecked ? 'bg-green-600' : 'bg-gray-400'}`}
                ></div>
                <div
                    className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${isChecked ? 'translate-x-5' : ''}`}
                ></div>
            </div>
        </label>
    );

}