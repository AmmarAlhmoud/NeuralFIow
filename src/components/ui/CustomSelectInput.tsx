import React, { useState, useEffect } from "react";
import Select, {
  type ActionMeta,
  type MultiValue,
  type SingleValue,
  type FormatOptionLabelMeta,
} from "react-select";
import { type Assignee } from "../../types/workspace";

type OptionType = { value: string; label: string };
type SelectOption = OptionType | Assignee;

const isAssignee = (option: SelectOption): option is Assignee => {
  return "name" in option && "email" in option;
};

const isOptionType = (option: SelectOption): option is OptionType => {
  return "value" in option && "label" in option;
};

interface CustomSelectInputProps {
  value: string | string[] | Assignee[] | number;
  onChange: (selected: string | string[] | Assignee[] | number) => void;
  options: OptionType[] | Assignee[];
  isMulti?: boolean;
  placeholder?: string;
  isAssigneeSelect?: boolean;
}

export const CustomSelectInput: React.FC<CustomSelectInputProps> = ({
  value,
  onChange,
  options,
  isMulti = true,
  placeholder = "Select...",
  isAssigneeSelect = false,
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof document !== "undefined") {
        setIsDark(document.documentElement.classList.contains("dark"));
      }
    };

    checkDarkMode();

    if (typeof document !== "undefined") {
      const observer = new MutationObserver(checkDarkMode);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => observer.disconnect();
    }
  }, []);

  // Map value correctly based on type
  const selectValue = isAssigneeSelect
    ? isMulti
      ? Array.isArray(value) && value.length > 0
        ? (value as Assignee[])
        : []
      : Array.isArray(value) && value.length > 0
      ? (value as Assignee[])[0]
      : null
    : isMulti
    ? Array.isArray(value)
      ? value.map((v) => {
          const option = (options as OptionType[]).find((o) => o.value === v);
          return option || { value: v as string, label: v as string };
        })
      : []
    : (options as OptionType[]).find((o) => o.value === value) || null;

  return (
    <Select<SelectOption, boolean>
      isMulti={isMulti}
      options={options as SelectOption[]}
      placeholder={placeholder}
      value={selectValue}
      menuPortalTarget={document.body}
      menuPosition="fixed"
      openMenuOnFocus={false}
      blurInputOnSelect={!isMulti}
      closeMenuOnSelect={!isMulti}
      className="custom-react-select-container"
      classNamePrefix="custom-react-select"
      getOptionLabel={(option: SelectOption) => {
        if (isAssigneeSelect && isAssignee(option)) {
          return option.name;
        } else if (!isAssigneeSelect && isOptionType(option)) {
          return option.label;
        }
        return "";
      }}
      getOptionValue={(option: SelectOption) => {
        if (isAssigneeSelect && isAssignee(option)) {
          return option._id || option.email;
        } else if (!isAssigneeSelect && isOptionType(option)) {
          return option.value;
        }
        return "";
      }}
      formatOptionLabel={
        isAssigneeSelect
          ? (
              option: SelectOption,
              labelMeta: FormatOptionLabelMeta<SelectOption>
            ) => {
              if (isAssignee(option)) {
                return (
                  <div className="flex items-center gap-2">
                    {option.avatarURL ? (
                      <img
                        src={option.avatarURL}
                        alt={option.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-medium">
                        {option.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{option.name}</span>
                      {labelMeta.context === "menu" && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {option.email}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            }
          : undefined
      }
      onInputChange={(inputValue, actionMeta) => {
        if (actionMeta.action === "menu-close") {
          return "";
        }
        return inputValue;
      }}
      onChange={(
        newValue: MultiValue<SelectOption> | SingleValue<SelectOption>,
        _actionMeta: ActionMeta<SelectOption>
      ) => {
        if (isAssigneeSelect) {
          if (isMulti) {
            const assignees = newValue
              ? [...(newValue as MultiValue<Assignee>)]
              : [];
            onChange(assignees);
          } else {
            const assignee = newValue ? [newValue as Assignee] : [];
            onChange(assignee);
          }
        } else {
          if (isMulti) {
            const values = newValue
              ? [...(newValue as MultiValue<OptionType>)].map((s) => s.value)
              : [];
            onChange(values);
          } else {
            const singleValue =
              (newValue as SingleValue<OptionType>)?.value || "";
            onChange(singleValue);
          }
        }
      }}
      styles={{
        control: (base, state) => ({
          ...base,
          borderRadius: "1rem",
          paddingLeft: "0.75rem",
          paddingRight: "0.75rem",
          minHeight: "3rem",
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.05)",
          border: state.isFocused
            ? "1px solid rgba(139,92,246,0.6)"
            : isDark
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.1)",
          boxShadow: state.isFocused ? "0 0 12px rgba(139,92,246,0.4)" : "none",
          color: isDark ? "#fff" : "#000",
          fontSize: "0.95rem",
          transition: "all 0.3s",
        }),
        placeholder: (base) => ({
          ...base,
          color: isDark ? "rgba(156,163,175,1)" : "rgba(31,41,55,0.8)",
        }),
        input: (base) => ({ ...base, color: isDark ? "#fff" : "#000" }),
        singleValue: (base) => ({ ...base, color: isDark ? "#fff" : "#000" }),
        multiValue: (base) => ({
          ...base,
          backgroundColor: isDark
            ? "rgba(139,92,246,0.2)"
            : "rgba(139,92,246,0.15)",
          borderRadius: "9999px",
          paddingLeft: "0.5rem",
          paddingRight: "0.5rem",
          ...(isAssigneeSelect && {
            paddingLeft: "0.25rem",
            paddingRight: "0.5rem",
          }),
        }),
        multiValueLabel: (base) => ({
          ...base,
          color: isDark ? "#c4b5fd" : "#000",
          fontSize: "0.875rem",
          ...(isAssigneeSelect && {
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }),
        }),
        multiValueRemove: (base) => ({
          ...base,
          color: isDark ? "#c4b5fd" : "#000",
          cursor: "pointer",
          ":hover": {
            backgroundColor: "rgba(239,68,68,0.6)",
            color: "#fff",
            borderRadius: "9999px",
          },
        }),
        menuPortal: (base) => ({
          ...base,
          zIndex: 10000,
        }),
        menu: (base) => ({
          ...base,
          borderRadius: "1rem",
          marginTop: "0.5rem",
          backgroundColor: isDark ? "rgba(31,41,55,1)" : "rgba(255,255,255,1)",
          border: isDark
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.1)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          overflow: "hidden",
          zIndex: 10000,
        }),
        option: (base, state) => ({
          ...base,
          padding: isAssigneeSelect ? "0.75rem" : "0.5rem 0.75rem",
          borderRadius: "0.5rem",
          backgroundColor: state.isSelected
            ? isDark
              ? "rgba(139,92,246,0.4)"
              : "rgba(139,92,246,0.3)"
            : "transparent",
          color: isDark ? "#fff" : "#000",
          cursor: "pointer",
          transition: "background-color 0.2s",
          ":hover": {
            backgroundColor: isDark
              ? "rgba(139,92,246,0.2)"
              : "rgba(139,92,246,0.15)",
          },
        }),
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 16,
        colors: {
          ...theme.colors,
          primary: "rgba(139,92,246,0.6)",
          primary25: "transparent",
          neutral0: "transparent",
        },
      })}
    />
  );
};
