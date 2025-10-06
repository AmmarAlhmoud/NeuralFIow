import React, { useState, type ReactNode } from "react";
import { DateTime } from "luxon";
import { TimezoneContext } from "./TimezoneContext";

export const TimezoneProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [timezone, setTimezone] = useState(userTimezone);

  const formatDate = (date: Date | string) => {
    const dt =
      typeof date === "string"
        ? DateTime.fromISO(date)
        : DateTime.fromJSDate(date);

    if (!dt.isValid) return "Invalid date";
    return dt.setZone(timezone).toFormat("yyyy LLL dd / HH:mm");
  };

  return (
    <TimezoneContext.Provider value={{ timezone, setTimezone, formatDate }}>
      {children}
    </TimezoneContext.Provider>
  );
};
