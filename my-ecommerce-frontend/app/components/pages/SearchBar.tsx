import React from "react";
import styles from "@styles/SearchBar.module.css";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validInput = value.replace(/[^a-zA-Z0-9_ ]/g, ""); 
    onSearchChange(validInput);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="🔍 Search for a product..."
          className={styles.searchBar}
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;
