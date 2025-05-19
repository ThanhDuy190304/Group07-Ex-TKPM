import { useState, useRef, useEffect } from 'react';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface Option {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: Option[];
    initialSelectedOptions?: string[];
    placeholder?: string;
    onChange: (selectedOptions: string[]) => void;
}

export function MultiSelect({ options, initialSelectedOptions = [], onChange, placeholder = "" }: MultiSelectProps) {
    const [selectedOptions, setSelectedOptions] = useState<string[]>(initialSelectedOptions);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const focusRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        onChange(selectedOptions);
    }, [selectedOptions]);

    const optionRefs = useRef<(HTMLLabelElement | null)[]>([]);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
        }
        if (!isOpen) return;
        if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
            const searchChar = e.key.toLowerCase();
            const index = options.findIndex(opt =>
                opt.value.toLowerCase().startsWith(searchChar)
            );
            if (index !== -1) {
                optionRefs.current[index]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }
    };
    return (
        <div className='min-w-40 flex-col gap-2'>
            {/* Select Box */}
            <div tabIndex={0}
                ref={focusRef}
                onKeyDown={handleKeyDown}
                className="relative w-full h-10 cursor-pointer inline-flex outline-none
                    border border-solid border-2 rounded-lg border-[#CDD7E1] focus:border-[#0b6bcb] "
                onClick={() => setIsOpen((prev) => !prev)}>
                {/*Selected Text */}
                <div className="flex-grow overflow-hidden px-2 py-1 flex flex-wrap items-center">
                    {selectedOptions.length === 0 ? (
                        <span className="text-gray-400 text-sm">{placeholder}</span>
                    ) : (
                        <span
                            className="text-sm px-2 py-1 whitespace-nowrap overflow-hidden text-ellipsis w-full"
                            title={selectedOptions.filter(v => v).join(", ")}
                        >
                            {selectedOptions.filter(v => v).join(", ")}
                        </span>
                    )}
                </div>

                {/* Uncheck full */}
                {selectedOptions.length > 0 && (
                    <div className="flex items-center justify-center px-1">
                        <XMarkIcon
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOptions([]);
                            }}
                            className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
                        />
                    </div>
                )}

                {/* Chevron Icon */}
                <div className="flex items-center justify-center px-1">
                    <ChevronDownIcon className="w-5 h-5" />
                </div>
            </div >

            {/* Dropdown Options */}
            {
                isOpen && (
                    <div className="absolute top-full mt-1 z-10 w-full 
                                    border border-[#CDD7E1] rounded-lg 
                                    bg-white shadow-md max-h-40 overflow-auto">
                        {options.map((option, index) => (
                            <label
                                key={option.value}
                                ref={(el) => { optionRefs.current[index] = el; }}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedOptions.includes(option.value)}
                                    className='outline-none'
                                    onChange={() => {
                                        if (selectedOptions.includes(option.value)) {
                                            // uncheck
                                            const newSelected = selectedOptions.filter(val => val !== option.value);
                                            setSelectedOptions(newSelected);
                                        } else {
                                            // check
                                            const newSelected = [...selectedOptions, option.value];
                                            setSelectedOptions(newSelected);
                                        }
                                        focusRef.current?.focus();
                                    }}
                                />
                                <span className="text-sm">{option.value}</span>
                            </label>
                        ))}
                    </div>
                )
            }
        </div>
    );
}

