'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Heart, 
  Target, 
  FileText,
  Repeat,
  Folder,
  Settings,
  Mail,
  ShieldCheck,
  FileBarChart,
  UserCog,
  Activity,
  Award
} from 'lucide-react';
import { useAuth } from '../providers/AuthProvider';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  resource?: string; // Resource required to view this item. Undefined means everyone can see it.
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Donors', href: '/dashboard/donors', icon: Users, resource: 'donors' },
  { name: 'Donations', href: '/dashboard/donations', icon: Heart, resource: 'donations' },
  { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: Repeat, resource: 'subscriptions' },
  { name: 'Certificates', href: '/dashboard/certificates', icon: Award, resource: 'certificates' },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: Target, resource: 'campaigns' },
  { name: 'Projects', href: '/dashboard/projects', icon: Folder, resource: 'projects' },
  { name: 'Content CMS', href: '/dashboard/cms', icon: FileText, resource: 'cms' },
  { name: 'Enquiries', href: '/dashboard/enquiries', icon: Mail, resource: 'enquiries' },
  { name: 'Compliance 80G', href: '/dashboard/compliance', icon: ShieldCheck, resource: 'compliance' },
  { name: 'Reports', href: '/dashboard/reports', icon: FileBarChart, resource: 'reports' },
  { name: 'Form 10BE', href: '/dashboard/compliance/10be', icon: FileText, resource: 'reports' },
  { name: 'Bank Reconcile', href: '/dashboard/reconciliation', icon: Target, resource: 'donations' },
  { name: 'Users & Roles', href: '/dashboard/users', icon: UserCog, resource: 'users' },
  { name: 'Audit Logs', href: '/dashboard/audit-logs', icon: Activity, resource: 'audit_logs' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, resource: 'settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const hasAccess = (item: NavItem) => {
    if (!item.resource) return true;
    if (!user) return false;
    // Super admins typically have access to everything, or check specific permissions
    if (user.role.name === 'SUPER_ADMIN') return true;
    // Check if user has read permission for the resource
    return user.role.permissions.some(p => 
      (p.resource === item.resource || p.resource === 'all') && 
      (p.action === 'read' || p.action === 'manage')
    );
  };

  const authorizedNavigation = navigation.filter(hasAccess);

  return (
    <div className="flex flex-col w-64 bg-gray-900 border-r border-gray-800">
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <span className="text-xl font-bold text-white">CHAH Admin</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 mt-6 space-y-1 pb-4">
          {authorizedNavigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
