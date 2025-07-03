import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaTag, FaList, FaPlus, FaTrash } from 'react-icons/fa';

const TaskForm = ({ task, lists, tags, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'متوسط',
    due_date: '',
    due_time: '',
    list_id: '',
    tags: []
  });

  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'متوسط',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
        due_time: task.due_time || '',
        list_id: task.list_id || '',
        tags: task.tags || []
      });
      setSubtasks(task.subtasks || []);
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'عنوان تسک الزامی است';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submitData = {
      ...formData,
      due_date: formData.due_date || null,
      due_time: formData.due_time || null,
      list_id: formData.list_id || null,
    };

    onSubmit(submitData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId) 
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks(prev => [...prev, {
        id: Date.now().toString(),
        title: newSubtask.trim(),
        completed: false
      }]);
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleSubtask = (index) => {
    setSubtasks(prev => prev.map((subtask, i) => 
      i === index ? { ...subtask, completed: !subtask.completed } : subtask
    ));
  };

  const priorityOptions = [
    { value: 'کم', label: 'کم', color: 'text-green-600' },
    { value: 'متوسط', label: 'متوسط', color: 'text-yellow-600' },
    { value: 'بالا', label: 'بالا', color: 'text-red-600' }
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {task ? 'ویرایش تسک' : 'تسک جدید'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Title */}
            <div className="form-group">
              <label className="form-label">عنوان تسک *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                placeholder="عنوان تسک را وارد کنید"
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">توضیحات</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="form-textarea"
                placeholder="توضیحات تسک (اختیاری)"
              />
            </div>

            {/* Priority and List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Priority */}
              <div className="form-group">
                <label className="form-label">اولویت</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* List */}
              <div className="form-group">
                <label className="form-label">لیست</label>
                <select
                  name="list_id"
                  value={formData.list_id}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">انتخاب لیست</option>
                  {lists.map(list => (
                    <option key={list.id} value={list.id}>
                      {list.icon} {list.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Due Date */}
              <div className="form-group">
                <label className="form-label">
                  <FaCalendarAlt className="inline w-4 h-4 ml-1" />
                  تاریخ سررسید
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>

              {/* Due Time */}
              <div className="form-group">
                <label className="form-label">
                  <FaClock className="inline w-4 h-4 ml-1" />
                  زمان سررسید
                </label>
                <input
                  type="time"
                  name="due_time"
                  value={formData.due_time}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="form-group">
                <label className="form-label">
                  <FaTag className="inline w-4 h-4 ml-1" />
                  برچسب‌ها
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        formData.tags.includes(tag.id)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Subtasks */}
            <div className="form-group">
              <label className="form-label">زیر تسک‌ها</label>
              
              {/* Add Subtask */}
              <div className="flex space-x-2 space-x-reverse mb-3">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                  className="input-field"
                  placeholder="زیر تسک جدید"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="btn-primary px-3"
                >
                  <FaPlus className="w-4 h-4" />
                </button>
              </div>

              {/* Subtasks List */}
              {subtasks.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {subtasks.map((subtask, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-2 space-x-reverse p-2 bg-gray-50 rounded-lg"
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleSubtask(index)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          subtask.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300'
                        }`}
                      >
                        {subtask.completed && <span className="text-xs">✓</span>}
                      </button>
                      
                      <span className={`flex-1 text-sm ${
                        subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'
                      }`}>
                        {subtask.title}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(index)}
                        className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions border-t pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              لغو
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {task ? 'به‌روزرسانی' : 'ایجاد تسک'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;