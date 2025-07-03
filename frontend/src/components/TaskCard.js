import React, { useState } from 'react';
import { 
  FaCheck, 
  FaEdit, 
  FaTrash, 
  FaCalendarAlt, 
  FaClock, 
  FaTag,
  FaList,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import persianDateUtils from '../utils/persianDate';

const TaskCard = ({ task, onToggle, onEdit, onDelete, lists, tags }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'بالا':
        return 'priority-high';
      case 'متوسط':
        return 'priority-medium';
      case 'کم':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'تکمیل شده':
        return 'status-completed';
      case 'لغو شده':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return persianDateUtils.formatPersianDate(dateString);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return persianDateUtils.formatPersianTime(timeString);
  };

  const getList = (listId) => {
    return lists.find(list => list.id === listId);
  };

  const getTag = (tagId) => {
    return tags.find(tag => tag.id === tagId);
  };

  const isCompleted = task.status === 'تکمیل شده';
  const isOverdue = persianDateUtils.isOverdue(task.due_date) && !isCompleted;

  return (
    <div className={`task-card ${isCompleted ? 'completed' : ''} ${isOverdue ? 'border-red-300' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 space-x-reverse flex-1">
          {/* Checkbox */}
          <button
            onClick={onToggle}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              isCompleted 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {isCompleted && <FaCheck className="w-3 h-3" />}
          </button>

          {/* Task Content */}
          <div className="flex-1">
            <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`text-sm mt-1 ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {/* Priority */}
              <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityClass(task.priority)}`}>
                {task.priority}
              </span>

              {/* Status */}
              <span className={`status-badge ${getStatusClass(task.status)}`}>
                {task.status}
              </span>

              {/* Due Date */}
              {task.due_date && (
                <div className={`flex items-center space-x-1 space-x-reverse text-xs ${
                  isOverdue ? 'text-red-600' : 'text-gray-600'
                }`}>
                  <FaCalendarAlt className="w-3 h-3" />
                  <span>{formatDate(task.due_date)}</span>
                </div>
              )}

              {/* Due Time */}
              {task.due_time && (
                <div className="flex items-center space-x-1 space-x-reverse text-xs text-gray-600">
                  <FaClock className="w-3 h-3" />
                  <span>{formatTime(task.due_time)}</span>
                </div>
              )}

              {/* List */}
              {task.list_id && getList(task.list_id) && (
                <div className="flex items-center space-x-1 space-x-reverse text-xs text-gray-600">
                  <FaList className="w-3 h-3" />
                  <span>{getList(task.list_id).name}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.tags.map((tagId, index) => {
                  const tag = getTag(tagId);
                  return tag ? (
                    <span 
                      key={index}
                      className="tag text-xs"
                      style={{ backgroundColor: tag.color + '20', color: tag.color }}
                    >
                      <FaTag className="w-3 h-3 inline mr-1" />
                      {tag.name}
                    </span>
                  ) : null;
                })}
              </div>
            )}

            {/* Subtasks */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    زیر تسک‌ها ({task.subtasks.filter(st => st.completed).length}/{task.subtasks.length})
                  </span>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showDetails ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
                
                {showDetails && (
                  <div className="mt-2 space-y-1">
                    {task.subtasks.map((subtask, index) => (
                      <div key={index} className="flex items-center space-x-2 space-x-reverse text-sm">
                        <div className={`w-3 h-3 rounded border ${
                          subtask.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300'
                        }`} />
                        <span className={subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={onEdit}
            className="p-1.5 rounded hover:bg-blue-100 text-blue-600 transition-colors"
            title="ویرایش"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => {
              if (window.confirm('آیا مطمئن هستید؟')) {
                onDelete();
              }
            }}
            className="p-1.5 rounded hover:bg-red-100 text-red-600 transition-colors"
            title="حذف"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar for subtasks */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-3">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%` 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;