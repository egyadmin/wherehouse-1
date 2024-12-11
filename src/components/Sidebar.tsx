import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Wrench,
  PackageSearch,
  Settings,
  FileBarChart,
  LogOut,
  Activity,
  Building2,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Users,
  Clock,
  ClipboardList,
  FileText,
  Percent,
  Factory,
  Building,
  TruckIcon,
  Fuel,
  Layers,
  Warehouse,
  UserPlus
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { authService } from '../api/services/authService';
import type { Module } from '../types';
import RegisterForm from './auth/RegisterForm';

interface SidebarProps {
  activeModule: Module;
  onModuleChange: (module: Module) => void;
}

export default function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleRegisterSubmit = async (data: any) => {
    try {
      console.log('Registering new user:', data);
      alert('تم تسجيل المستخدم بنجاح');
      setShowRegisterForm(false);
    } catch (error) {
      console.error('Registration error:', error);
      alert('حدث خطأ أثناء تسجيل المستخدم');
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: 'لوحة التحكم',
      path: '/'
    },
    {
      id: 'production',
      icon: Factory,
      label: 'الإنتاج والكسارات',
      path: '/production',
      subItems: [
        { id: 'production-dashboard', label: 'لوحة الإنتاج', path: '/production' },
        { id: 'crushers', label: 'الكسارات', path: '/production/crushers' },
        { id: 'production-inventory', label: 'مخزون الإنتاج', path: '/production/inventory' },
        { id: 'fuel-consumption', label: 'استهلاك الوقود', path: '/production/fuel' }
      ]
    },
    {
      id: 'suppliers',
      icon: Building,
      label: 'الموردين',
      path: '/suppliers',
      subItems: [
        { id: 'suppliers-list', label: 'قائمة الموردين', path: '/suppliers' },
        { id: 'transactions', label: 'المعاملات', path: '/suppliers/transactions' }
      ]
    },
    {
      id: 'local-content',
      icon: Percent,
      label: 'المحتوى المحلي',
      path: '/local-content',
      subItems: [
        { id: 'local-content-dashboard', label: 'لوحة التحكم', path: '/local-content' },
        { id: 'local-content-analysis', label: 'تحليل المحتوى', path: '/local-content/analysis' },
        { id: 'mandatory-list', label: 'القائمة الإلزامية', path: '/local-content/mandatory-list' }
      ]
    },
    {
      id: 'assets',
      icon: Box,
      label: 'الأصول',
      path: '/assets',
      subItems: [
        { id: 'assets-list', label: 'قائمة الأصول', path: '/assets' },
        { id: 'maintenance-schedule', label: 'جدول الصيانة', path: '/assets/maintenance' },
        { id: 'asset-locations', label: 'مواقع الأصول', path: '/assets/locations' }
      ]
    },
    {
      id: 'workOrders',
      icon: Wrench,
      label: 'أوامر العمل',
      path: '/work-orders',
      subItems: [
        { id: 'work-orders-list', label: 'قائمة أوامر العمل', path: '/work-orders' },
        { id: 'work-orders-calendar', label: 'التقويم', path: '/work-orders/calendar' },
        { id: 'maintenance-teams', label: 'فرق الصيانة', path: '/work-orders/teams' }
      ]
    },
    {
      id: 'inventory',
      icon: PackageSearch,
      label: 'المخزون',
      path: '/inventory',
      subItems: [
        { id: 'inventory-dashboard', label: 'لوحة المخزون', path: '/inventory' },
        { id: 'inventory-list', label: 'قائمة المخزون', path: '/inventory/list' },
        { id: 'stock-count', label: 'جرد المخزون', path: '/inventory/stock-count' },
        { id: 'low-stock', label: 'المواد المنخفضة', path: '/inventory/low-stock' },
        { id: 'transfers', label: 'التحويلات', path: '/inventory/transfers' }
      ]
    },
    {
      id: 'warehouses',
      icon: Warehouse,
      label: 'المستودعات',
      path: '/warehouses',
      subItems: [
        { id: 'warehouses-list', label: 'قائمة المستودعات', path: '/warehouses' },
        { id: 'truck-tracking', label: 'تتبع الشاحنات', path: '/warehouses/tracking' }
      ]
    },
    {
      id: 'attendance',
      icon: Clock,
      label: 'الحضور والانصراف',
      path: '/attendance'
    },
    {
      id: 'reports',
      icon: FileBarChart,
      label: 'التقارير',
      path: '/reports'
    },
    {
      id: 'activities',
      icon: Activity,
      label: 'النشاطات',
      path: '/activities'
    },
    {
      id: 'users',
      icon: Users,
      label: 'المستخدمين',
      path: '/users'
    }
  ];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleModuleChange = (moduleId: Module, path: string) => {
    onModuleChange(moduleId);
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:relative lg:w-64 lg:flex-shrink-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b">
          <Warehouse className="w-8 h-8 text-blue-600" />
          <span className="mr-2 text-xl font-bold text-gray-900">نظام المستودعات</span>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.subItems) {
                    toggleMenu(item.id);
                  } else {
                    handleModuleChange(item.id as Module, item.path);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 ml-2" />
                  <span>{item.label}</span>
                </div>
                {item.subItems && (
                  expandedMenus[item.id] ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )
                )}
              </button>

              {item.subItems && expandedMenus[item.id] && (
                <div className="mt-1 mr-4 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleModuleChange(item.id as Module, subItem.path)}
                      className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive(subItem.path)
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Register User Button */}
          <button
            onClick={() => setShowRegisterForm(true)}
            className="w-full flex items-center px-4 py-2 mt-4 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <UserPlus className="w-5 h-5 ml-2" />
            تسجيل مستخدم جديد
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 mt-4 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 ml-2" />
            تسجيل الخروج
          </button>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Register Form Modal */}
      {showRegisterForm && (
        <RegisterForm
          onSubmit={handleRegisterSubmit}
          onClose={() => setShowRegisterForm(false)}
        />
      )}
    </>
  );
}