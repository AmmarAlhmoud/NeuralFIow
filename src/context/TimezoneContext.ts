import { createContext } from "react";

interface TimezoneContextType {
  timezone: string;
  setTimezone: (tz: string) => void;
  formatDate: (date: Date | string) => string;
}

export const TimezoneContext = createContext<TimezoneContextType | undefined>(
  undefined
);
