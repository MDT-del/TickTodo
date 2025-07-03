import React, { useState, useEffect } from 'react';
import './App.css';
import api from './services/api';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';

function App() {
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [tags, setTags] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedList, setSelectedList] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksRes, listsRes, tagsRes, statsRes] = await Promise.all([
        api.getTasks(),
        api.getLists(),
        api.getTags(),
        api.getStats()
      ]);
      
      setTasks(tasksRes.data);
      setLists(listsRes.data);
      setTags(tagsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError('خطا در بارگذاری داده‌ها');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Task operations
  const handleCreateTask = async (taskData) => {
    try {
      const response = await api.createTask(taskData);
      setTasks([response.data, ...tasks]);
      setShowTaskForm(false);
      await loadData(); // Refresh stats
    } catch (err) {
      setError('خطا در ایجاد تسک');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await api.updateTask(taskId, taskData);
      setTasks(tasks.map(task => task.id === taskId ? response.data : task));
      setEditingTask(null);
      await loadData(); // Refresh stats
    } catch (err) {
      setError('خطا در به‌روزرسانی تسک');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      await loadData(); // Refresh stats
    } catch (err) {
      setError('خطا در حذف تسک');
      console.error('Error deleting task:', err);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'در انتظار' ? 'تکمیل شده' : 'در انتظار';
    await handleUpdateTask(taskId, { status: newStatus });
  };

  // List operations
  const handleCreateList = async (listData) => {
    try {
      const response = await api.createList(listData);
      setLists([response.data, ...lists]);
    } catch (err) {
      setError('خطا در ایجاد لیست');
      console.error('Error creating list:', err);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await api.deleteList(listId);
      setLists(lists.filter(list => list.id !== listId));
      if (selectedList === listId) {
        setSelectedList(null);
      }
      await loadData(); // Refresh tasks and stats
    } catch (err) {
      setError('خطا در حذف لیست');
      console.error('Error deleting list:', err);
    }
  };

  // Tag operations
  const handleCreateTag = async (tagData) => {
    try {
      const response = await api.createTag(tagData);
      setTags([response.data, ...tags]);
    } catch (err) {
      setError('خطا در ایجاد برچسب');
      console.error('Error creating tag:', err);
    }
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await api.deleteTag(tagId);
      setTags(tags.filter(tag => tag.id !== tagId));
    } catch (err) {
      setError('خطا در حذف برچسب');
      console.error('Error deleting tag:', err);
    }
  };

  // Filter and search
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesList = !selectedList || task.list_id === selectedList;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesList && matchesStatus && matchesPriority;
  });

  // Group tasks by status
  const pendingTasks = filteredTasks.filter(task => task.status === 'در انتظار');
  const completedTasks = filteredTasks.filter(task => task.status === 'تکمیل شده');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-gray-50">
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onShowTaskForm={() => setShowTaskForm(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        lists={lists}
        onCreateList={handleCreateList}
        onDeleteList={handleDeleteList}
        selectedList={selectedList}
        onSelectList={setSelectedList}
        currentView={currentView}
        onChangeView={setCurrentView}
        stats={stats}
      />

      <main className="app-main">
        <div className="container py-6">
          {error && (
            <div className="toast-notification error mb-4">
              {error}
              <button 
                onClick={() => setError(null)}
                className="mr-2 text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
          )}

          {currentView === 'dashboard' && (
            <Dashboard 
              stats={stats}
              recentTasks={tasks.slice(0, 5)}
              onTaskClick={(task) => setEditingTask(task)}
            />
          )}

          {currentView === 'tasks' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="page-title">
                  {selectedList ? lists.find(l => l.id === selectedList)?.name : 'همه تسک‌ها'}
                </h1>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="btn-primary flex items-center space-x-2 space-x-reverse"
                >
                  <FaPlus className="w-4 h-4" />
                  <span>تسک جدید</span>
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-card p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <FaFilter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">فیلتر:</span>
                  </div>
                  
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="form-select w-auto"
                  >
                    <option value="all">همه وضعیت‌ها</option>
                    <option value="در انتظار">در انتظار</option>
                    <option value="تکمیل شده">تکمیل شده</option>
                  </select>
                  
                  <select 
                    value={filterPriority} 
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="form-select w-auto"
                  >
                    <option value="all">همه اولویت‌ها</option>
                    <option value="بالا">بالا</option>
                    <option value="متوسط">متوسط</option>
                    <option value="کم">کم</option>
                  </select>
                  
                  {(filterStatus !== 'all' || filterPriority !== 'all') && (
                    <button
                      onClick={() => {
                        setFilterStatus('all');
                        setFilterPriority('all');
                      }}
                      className="btn-secondary text-sm"
                    >
                      پاک کردن فیلتر
                    </button>
                  )}
                </div>
              </div>

              {/* Tasks Grid */}
              <div className="tasks-grid">
                {/* Pending Tasks */}
                <div className="tasks-column">
                  <div className="column-header">
                    <h3 className="column-title">در انتظار</h3>
                    <span className="task-count">{pendingTasks.length}</span>
                  </div>
                  <div className="space-y-3">
                    {pendingTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={() => handleToggleTask(task.id, task.status)}
                        onEdit={() => setEditingTask(task)}
                        onDelete={() => handleDeleteTask(task.id)}
                        lists={lists}
                        tags={tags}
                      />
                    ))}
                    {pendingTasks.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>هیچ تسک در انتظاری وجود ندارد</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Completed Tasks */}
                <div className="tasks-column">
                  <div className="column-header">
                    <h3 className="column-title">تکمیل شده</h3>
                    <span className="task-count">{completedTasks.length}</span>
                  </div>
                  <div className="space-y-3">
                    {completedTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={() => handleToggleTask(task.id, task.status)}
                        onEdit={() => setEditingTask(task)}
                        onDelete={() => handleDeleteTask(task.id)}
                        lists={lists}
                        tags={tags}
                      />
                    ))}
                    {completedTasks.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>هیچ تسک تکمیل شده‌ای وجود ندارد</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Column */}
                <div className="tasks-column">
                  <div className="column-header">
                    <h3 className="column-title">آمار</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="stat-card">
                      <div className="stat-number text-blue-600">{stats.total_tasks || 0}</div>
                      <div className="stat-label">کل تسک‌ها</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number text-green-600">{stats.completion_rate || 0}%</div>
                      <div className="stat-label">درصد تکمیل</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number text-red-600">{stats.due_today || 0}</div>
                      <div className="stat-label">امروز سررسید</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number text-purple-600">{stats.high_priority || 0}</div>
                      <div className="stat-label">اولویت بالا</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Task Form Modal */}
          {(showTaskForm || editingTask) && (
            <TaskForm
              task={editingTask}
              lists={lists}
              tags={tags}
              onSubmit={editingTask ? 
                (data) => handleUpdateTask(editingTask.id, data) : 
                handleCreateTask
              }
              onClose={() => {
                setShowTaskForm(false);
                setEditingTask(null);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;