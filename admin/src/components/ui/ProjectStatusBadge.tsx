import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ProjectStatus } from '@/lib/types';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  PLANNED: {
    label: 'Planned',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200',
  },
  ACTIVE: {
    label: 'Active',
    className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200',
  },
  ON_HOLD: {
    label: 'On Hold',
    className: 'bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200',
  },
};

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.ON_HOLD;
  return (
    <Badge variant="outline" className={cn('font-medium text-xs', config.className)}>
      {config.label}
    </Badge>
  );
}
