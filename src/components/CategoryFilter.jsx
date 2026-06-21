/**
 * CategoryFilter component
 * Props:
 *   categories      {string[]}  - list of category labels
 *   selected        {string}    - currently selected category
 *   onSelect        {Function}  - called with the category label when clicked
 *   subCategories   {string[]}  - list of sub-category labels (optional)
 *   selectedSub     {string}    - currently selected sub-category
 *   onSelectSub     {Function}  - called with sub-category label when clicked
 */
export default function CategoryFilter({
  categories,
  selected,
  onSelect,
  subCategories,
  selectedSub,
  onSelectSub,
}) {
  return (
    <div className="cf-wrapper">
      {/* Main categories */}
      <div className="cf-row">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-pill ${selected === cat ? 'active' : ''}`}
            onClick={() => onSelect(cat)}
            aria-pressed={selected === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sub-categories (only when available) */}
      {subCategories && subCategories.length > 0 && (
        <div className="cf-row cf-sub-row">
          {subCategories.map((sub) => (
            <button
              key={sub}
              type="button"
              className={`subcategory-pill ${selectedSub === sub ? 'active' : ''}`}
              onClick={() => onSelectSub(sub)}
              aria-pressed={selectedSub === sub}
            >
              {sub}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
