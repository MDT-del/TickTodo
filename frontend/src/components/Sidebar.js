import React, { useState } from 'react';
import { 
  FaTimes, 
  FaHome, 
  FaTasks, 
  FaList, 
  FaTag, 
  FaPlus, 
  FaTrash,
  FaChartBar,
  FaCog 
} from 'react-icons/fa';

const Sidebar = ({ 
  isOpen, 
  onClose, 
  lists, 
  onCreateList, 
  onDeleteList,
  selectedList,
  onSelectList,
  currentView,
  onChangeView,
  stats 
}) => {
  const [showListForm, setShowListForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListColor, setNewListColor] = useState('#3B82F6');
  const [newListIcon, setNewListIcon] = useState('📋');

  const handleCreateList = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      onCreateList({
        name: newListName,
        color: newListColor,
        icon: newListIcon
      });
      setNewListName('');
      setNewListColor('#3B82F6');
      setNewListIcon('📋');
      setShowListForm(false);
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'داشبورد',
      icon: FaHome,
      count: null
    },
    {
      id: 'tasks',
      label: 'همه تسک‌ها',
      icon: FaTasks,
      count: stats.total_tasks
    },
    {
      id: 'today',
      label: 'امروز',
      icon: FaChartBar,
      count: stats.due_today
    },
    {
      id: 'high-priority',
      label: 'اولویت بالا',
      icon: FaTag,
      count: stats.high_priority
    }
  ];

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
  ];

  const icons = ['📋', '📝', '💼', '🎯', '📚', '🏠', '💡', '🎨', '🔧', '📊'];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">منو</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="sidebar-menu">
              {menuItems.map(item => (
                <div
                  key={item.id}
                  className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
                  onClick={() => {
                    onChangeView(item.id);
                    onSelectList(null);
                    onClose();
                  }}
                >
                  <item.icon className="sidebar-icon" />
                  <span className="sidebar-text">{item.label}</span>
                  {item.count !== null && (
                    <span className={`sidebar-badge ${currentView === item.id ? 'active' : ''}`}>
                      {item.count}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Lists Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">لیست‌ها</h3>
                <button
                  onClick={() => setShowListForm(true)}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                >
                  <FaPlus className="w-3 h-3 text-gray-500" />
                </button>
              </div>

              {/* List Form */}
              {showListForm && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <form onSubmit={handleCreateList} className="space-y-3">
                    <input
                      type="text"
                      placeholder="نام لیست"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      className="input-field text-sm"
                      required
                    />
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <select
                        value={newListIcon}
                        onChange={(e) => setNewListIcon(e.target.value)}
                        className="form-select text-sm w-20"
                      >
                        {icons.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                      
                      <div className="flex space-x-1 space-x-reverse">
                        {colors.map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setNewListColor(color)}
                            className={`w-6 h-6 rounded-full border-2 ${
                              newListColor === color ? 'border-gray-400' : 'border-gray-200'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        type="submit"
                        className="btn-primary text-sm py-1 px-3"
                      >
                        افزودن
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowListForm(false);
                          setNewListName('');
                        }}
                        className="btn-secondary text-sm py-1 px-3"
                      >
                        لغو
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Lists */}
              <div className="space-y-1">
                {lists.map(list => (
                  <div
                    key={list.id}
                    className={`sidebar-item ${selectedList === list.id ? 'active' : ''}`}
                    onClick={() => {
                      onSelectList(list.id);
                      onChangeView('tasks');
                      onClose();
                    }}
                  >
                    <span className="text-lg">{list.icon}</span>
                    <span className="sidebar-text">{list.name}</span>
                    <span className={`sidebar-badge ${selectedList === list.id ? 'active' : ''}`}>
                      {list.task_count}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('آیا مطمئن هستید؟')) {
                          onDeleteList(list.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 text-red-600 transition-all"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="sidebar-item">
              <FaCog className="sidebar-icon" />
              <span className="sidebar-text">تنظیمات</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;