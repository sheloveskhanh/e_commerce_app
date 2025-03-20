import styles from "../styles/AdminControl.module.css";
import { FaPlus } from "react-icons/fa";

interface AdminControlsProps {
  onAdd: () => void;
  isAdmin: boolean;
}

const AdminControls: React.FC<AdminControlsProps> = ({ onAdd, isAdmin }) => {
  if (!isAdmin) return null;

  return (
    <button className={styles.addButton} onClick={onAdd}>
      <FaPlus className={styles.addButtonIcon} /> Add Product
    </button>
  );
};

export default AdminControls;
