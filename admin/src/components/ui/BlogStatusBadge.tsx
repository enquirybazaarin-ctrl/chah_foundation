import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { BlogStatus } from '@/lib/types';

interface BlogStatusBadgeProps {
  status: BlogStatus;
}

const statusConfig: Record<BlogStatus, { label: string; className: string }> = {
  PUBLISHED: {
    label: 'Published',
    className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200',
  },
  DRAFT: {
    label: 'Draft',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200',
  },
  ARCHIVED: {
    label: 'Archived',
    className: 'bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200',
  },
};

export function BlogStatusBadge({ status }: BlogStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.DRAFT;
  return (
    <Badge variant="outline" className={cn('font-medium text-xs', config.className)}>
      {config.label}
    </Badge>
  );
}
