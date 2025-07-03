import React from 'react';
import { FaBars, FaPlus, FaSearch } from 'react-icons/fa';

const Header = ({ onToggleSidebar, onShowTaskForm, searchTerm, onSearchChange }) => {
  return (
    <header className="app-header">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
            >
              <FaBars className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              📋 مدیریت کارها
            </h1>
          </div>

          {/* Search Bar */}
          <div className="search-bar hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در تسک‌ها..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input"
              />
              <FaSearch className="search-icon" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={onShowTaskForm}
              className="btn-primary flex items-center space-x-2 space-x-reverse"
            >
              <FaPlus className="w-4 h-4" />
              <span className="hidden sm:inline">تسک جدید</span>
            </button>
            
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
            >
              <FaBars className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="search-bar md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو در تسک‌ها..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;