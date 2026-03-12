import React, { useState } from 'react';
import './FilterBar.css';

const FilterBar = ({ onFilterChange, onSortChange, documentCount }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('name');

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
    onSortChange(sort);
  };

  const filters = [
    { value: 'all', label: 'Tous', icon: '📄' },
    { value: 'pdf', label: 'PDF', icon: '📄' },
    { value: 'doc', label: 'Documents', icon: '📝' },
    { value: 'image', label: 'Images', icon: '🖼️' },
    { value: 'video', label: 'Vidéos', icon: '🎥' },
    { value: 'audio', label: 'Audio', icon: '🎵' },
    { value: 'archive', label: 'Archives', icon: '📦' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nom' },
    { value: 'date', label: 'Date' },
    { value: 'size', label: 'Taille' },
    { value: 'type', label: 'Type' }
  ];

  return (
    <div className="filter-bar">
      <div className="filter-section">
        <h4>Filtres ({documentCount} documents)</h4>
        <div className="filter-buttons">
          {filters.map((filter) => (
            <button
              key={filter.value}
              className={`filter-btn ${selectedFilter === filter.value ? 'active' : ''}`}
              onClick={() => handleFilterChange(filter.value)}
            >
              <span className="filter-icon">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sort-section">
        <h4>Trier par</h4>
        <select
          value={selectedSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="sort-select"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar; 