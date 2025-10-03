import { useContext } from "react";
import { TimezoneContext } from "../context/TimezoneContext";

const useTimezone = () => {
  const ctx = useContext(TimezoneContext);
  if (!ctx)
    throw new Error("useTimezone must be used within a TimezoneProvider");
  return ctx;
};

export default useTimezone;
