"use client";

import React, { useState, useEffect } from "react";
import styles from "./custonDropdown.module.css";

interface DropdownItem {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  items: DropdownItem[];
  placeholder: string;
  onSelect: (value: string) => void;
  value?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  placeholder,
  onSelect,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(placeholder);

  useEffect(() => {
    if (value) {
      const found = items.find((i) => i.value === value);
      setSelectedLabel(found?.label ?? placeholder);
    } else {
      setSelectedLabel(placeholder);
    }
  }, [value, items, placeholder]);

  const handleSelect = (item: DropdownItem) => {
    if (value === undefined) {
      setSelectedLabel(item.label);
    }
    onSelect(item.value);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdownContainer}>
      <div
        className={`${styles.dropdownHeader} ${
          isOpen ? styles.dropdownHeaderOpen : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.dropdownSelectedLabel}>{selectedLabel}</span>
        <span
          className={`${styles.dropdownArrow} ${
            isOpen ? styles.dropdownArrowOpen : ""
          }`}
        >
          &#9650;
        </span>
      </div>

      {isOpen && (
        <div className={styles.dropdownList}>
          {items.map((item, index) => (
            <div
              key={index}
              className={`${styles.dropdownItem} ${
                selectedLabel === item.label ? styles.dropdownItemSelected : ""
              }`}
              onClick={() => handleSelect(item)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
