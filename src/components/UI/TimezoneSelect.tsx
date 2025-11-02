import React, { useState, useEffect, useRef, type ChangeEvent } from "react";
import { getTimeZones } from "@vvo/tzdb";

type TimezoneSelectProps = {
  timezone: string;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

const TimezoneSelect: React.FC<TimezoneSelectProps> = ({
  timezone,
  handleChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayName = (tz: {
    name: string;
    alternativeName?: string;
    currentTimeOffsetInMinutes: number;
  }) => {
    const offsetHours = tz.currentTimeOffsetInMinutes / 60;
    const sign = offsetHours >= 0 ? "+" : "";
    return `${tz.alternativeName || tz.name} (UTC${sign}${offsetHours})`;
  };

  useEffect(() => {
    if (!isOpen) {
      const selectedTz = getTimeZones().find((tz) => tz.name === timezone);
      setSearchTerm(selectedTz ? displayName(selectedTz) : "");
    }
  }, [timezone, isOpen]);

  const filteredTimeZones = getTimeZones().filter((tz) => {
    const name = tz.alternativeName || tz.name;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleFocus = () => {
    setIsOpen(true);
    const selectedTz = getTimeZones().find((tz) => tz.name === timezone);
    const currentDisplay = selectedTz ? displayName(selectedTz) : "";
    if (searchTerm === currentDisplay) {
      setSearchTerm("");
    }
  };

  const handleBlur = () => {
    setIsOpen(false);
    if (!searchTerm) {
      const selectedTz = getTimeZones().find((tz) => tz.name === timezone);
      setSearchTerm(selectedTz ? displayName(selectedTz) : "");
    }
  };

  const selectOption = (name: string) => {
    const fakeEvent = {
      target: { name: "timezone", value: name },
    } as ChangeEvent<HTMLInputElement | HTMLSelectElement>;
    handleChange(fakeEvent);
    setIsOpen(false);
  };

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        if (!searchTerm) {
          const selectedTz = getTimeZones().find((tz) => tz.name === timezone);
          setSearchTerm(selectedTz ? displayName(selectedTz) : "");
        }
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [searchTerm, timezone]);

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        name="timezone"
        placeholder="Search or select timezone"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full pr-10 px-4 py-3 bg-white/5 dark:bg-gray-800/80 border border-black/10 dark:border-gray-700/70 rounded-xl text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#b74fd6]/50 dark:focus:ring-[#d64f4f]/50 backdrop-blur-sm input-glow transition-all"
        autoComplete="off"
        spellCheck={false}
      />

      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg
          className="w-3 h-3 text-dark dark:text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && filteredTimeZones.length > 0 && (
        <ul className="absolute z-10 max-h-60 w-full overflow-y-auto bg-white dark:bg-gray-800 border border-black/10 dark:border-gray-700 rounded-lg mt-1 shadow-lg">
          {filteredTimeZones.map((tz) => {
            const isSelected = tz.name === timezone;
            return (
              <li
                key={tz.name}
                onMouseDown={() => selectOption(tz.name)}
                className={`px-4 py-2 cursor-pointer hover:bg-[#b74fd6]/20 dark:hover:bg-[#d64f4f]/20 ${
                  isSelected
                    ? "bg-[#b74fd6]/40 dark:bg-[#d64f4f]/40 font-semibold"
                    : ""
                }`}
                aria-selected={isSelected}
                role="option"
              >
                {displayName(tz)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TimezoneSelect;
