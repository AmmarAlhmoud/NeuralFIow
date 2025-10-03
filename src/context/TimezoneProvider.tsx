import React, { useState, type ReactNode } from "react";
import { DateTime } from "luxon";
import { TimezoneContext } from "./TimezoneContext";

export const TimezoneProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [timezone, setTimezone] = useState("Europe/Istanbul");

  const formatDate = (date: Date | string) => {
    const dt =
      typeof date === "string"
        ? DateTime.fromISO(date)
        : DateTime.fromJSDate(date);

    return dt.setZone(timezone).toFormat("yyyy-MM-dd HH:mm:ss ZZZZ");
  };

  return (
    <TimezoneContext.Provider value={{ timezone, setTimezone, formatDate }}>
      {children}
    </TimezoneContext.Provider>
  );
};
