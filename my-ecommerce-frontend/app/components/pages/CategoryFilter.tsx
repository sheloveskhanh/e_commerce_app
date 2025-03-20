import styles from "@styles/CategoryFilter.module.css";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className={styles.categoryContainer}>
      <select
        className={styles.categoryDropdown}
        onChange={onCategoryChange}
        value={selectedCategory}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
