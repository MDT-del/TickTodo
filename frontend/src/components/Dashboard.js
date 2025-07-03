import React from 'react';
import { 
  FaTasks, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle, 
  FaCalendarAlt,
  FaChartLine,
  FaList,
  FaTag
} from 'react-icons/fa';
import persianDateUtils from '../utils/persianDate';

const Dashboard = ({ stats, recentTasks, onTaskClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return persianDateUtils.formatRelativePersianDate(dateString);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'بالا':
        return 'text-red-600';
      case 'متوسط':
        return 'text-yellow-600';
      case 'کم':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressColor = (rate) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">سلام! 👋</h1>
        <p className="text-blue-100 text-lg">
          خوش آمدید به مدیریت کارهای شما. بیایید امروز را پربار کنیم!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-number text-blue-600">{stats.total_tasks || 0}</div>
              <div className="stat-label">کل تسک‌ها</div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaTasks className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-number text-green-600">{stats.completed_tasks || 0}</div>
              <div className="stat-label">تکمیل شده</div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-number text-yellow-600">{stats.pending_tasks || 0}</div>
              <div className="stat-label">در انتظار</div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-number text-red-600">{stats.due_today || 0}</div>
              <div className="stat-label">امروز سررسید</div>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FaCalendarAlt className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress and Priority Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">پیشرفت کلی</h3>
            <FaChartLine className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">درصد تکمیل</span>
              <span className={`text-2xl font-bold ${getProgressColor(stats.completion_rate || 0)}`}>
                {stats.completion_rate || 0}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.completion_rate || 0}%` }}
              />
            </div>
            
            <div className="text-sm text-gray-600">
              {stats.completed_tasks || 0} از {stats.total_tasks || 0} تسک تکمیل شده
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">اولویت تسک‌ها</h3>
            <FaExclamationTriangle className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm text-gray-700">اولویت بالا</span>
              </div>
              <span className="text-sm font-medium text-red-600">
                {stats.high_priority || 0}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-sm text-gray-700">اولویت متوسط</span>
              </div>
              <span className="text-sm font-medium text-yellow-600">
                {stats.medium_priority || 0}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-700">اولویت کم</span>
              </div>
              <span className="text-sm font-medium text-green-600">
                {stats.low_priority || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">تسک‌های اخیر</h3>
          <FaList className="w-5 h-5 text-gray-500" />
        </div>
        
        {recentTasks && recentTasks.length > 0 ? (
          <div className="space-y-3">
            {recentTasks.map((task, index) => (
              <div 
                key={task.id || index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => onTaskClick(task)}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'بالا' ? 'bg-red-500' :
                    task.priority === 'متوسط' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900">{task.title}</div>
                    {task.due_date && (
                      <div className="text-sm text-gray-500">
                        {formatDate(task.due_date)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'تکمیل شده' ? 'bg-green-100 text-green-800' :
                    task.status === 'در انتظار' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FaTasks className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>هیچ تسک اخیری وجود ندارد</p>
            <p className="text-sm">یک تسک جدید ایجاد کنید تا شروع کنید!</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">عملیات سریع</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center space-x-2 space-x-reverse">
              <FaTasks className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">تسک جدید</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">یک تسک جدید اضافه کنید</p>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="flex items-center space-x-2 space-x-reverse">
              <FaList className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">لیست جدید</span>
            </div>
            <p className="text-sm text-green-700 mt-1">دسته‌بندی جدید ایجاد کنید</p>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <div className="flex items-center space-x-2 space-x-reverse">
              <FaTag className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-900">برچسب جدید</span>
            </div>
            <p className="text-sm text-purple-700 mt-1">برچسب‌های جدید بسازید</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;