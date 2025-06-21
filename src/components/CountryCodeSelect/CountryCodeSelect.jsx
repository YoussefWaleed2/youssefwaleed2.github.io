import React, { useState, useRef, useEffect } from 'react';
import { countryCodes } from '../../utils/countryCodes';
import './CountryCodeSelect.css';

const CountryCodeSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(
    countryCodes.find(country => country.dialCode === value) || null
  );
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedCountry(countryCodes.find(country => country.dialCode === value) || null);
  }, [value]);

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm('');
    onChange && onChange({
      target: {
        name: 'countryCode',
        value: country.dialCode
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCountries = countryCodes.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    country.dialCode.includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const flagUrl = (countryCode) => {
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  };

  return (
    <div className="country-code-dropdown" ref={dropdownRef}>
      <div 
        className="selected-country" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCountry ? (
          <>
            <img 
              src={flagUrl(selectedCountry.code)} 
              alt={selectedCountry.name} 
              className="country-flag"
            />
            <span className="country-code">{selectedCountry.dialCode}</span>
          </>
        ) : (
          <span className="country-placeholder">Select Country</span>
        )}
        <span className="dropdown-arrow">▼</span>
      </div>
      
      {isOpen && (
        <div className="country-options">
          <div className="country-search-container">
            <input 
              ref={searchInputRef}
              type="text" 
              className="country-search" 
              placeholder="Search country..." 
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="countries-list">
            {filteredCountries.map((country) => (
              <div 
                key={country.code} 
                className={`country-option ${selectedCountry && selectedCountry.code === country.code ? 'selected' : ''}`}
                onClick={() => handleSelect(country)}
              >
                <img 
                  src={flagUrl(country.code)} 
                  alt={country.name} 
                  className="country-flag" 
                />
                <span className="country-name">{country.name}</span>
                <span className="country-code">{country.dialCode}</span>
              </div>
            ))}
            {filteredCountries.length === 0 && (
              <div className="no-results">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryCodeSelect; 