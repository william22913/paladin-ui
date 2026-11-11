import { Search, X } from 'lucide-react';
import type { ChangeEvent } from 'react';
import styles from './ui.module.css';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  id?: string;
  onSubmit?: (value: string) => void;
}

export function SearchField({
  value,
  onChange,
  label,
  placeholder,
  id = 'catalog-search',
  onSubmit,
}: SearchFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <div className={styles.search}>
      <label className="visually-hidden" htmlFor={id}>
        {label}
      </label>
      <Search size={18} strokeWidth={1.5} className={styles.searchIcon} aria-hidden="true" />
      <input
        id={id}
        type="search"
        className={styles.searchInput}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={handleChange}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && value) onChange('');
          if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit?.(value);
          }
        }}
      />
      {value ? (
        <button
          type="button"
          className={styles.clear}
          aria-label="Clear search"
          onClick={() => onChange('')}
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      ) : null}
    </div>
  );
}
