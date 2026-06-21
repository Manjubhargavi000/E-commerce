import { Search, X } from 'lucide-react';

/**
 * SearchBar component
 * Props:
 *   value      {string}   - current search query
 *   onChange   {Function} - called with new string on change
 *   onClear    {Function} - called when X is clicked
 *   placeholder {string}  - input placeholder text
 */
export default function SearchBar({ value, onChange, onClear, placeholder = 'Search products...' }) {
  return (
    <div className="home-search-bar">
      <Search size={18} className="home-search-icon" />
      <input
        type="text"
        className="home-search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search products"
      />
      {value && (
        <button className="home-search-clear" onClick={onClear} aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
