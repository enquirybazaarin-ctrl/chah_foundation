import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CampaignStatus } from '@/lib/types';
import { PlayCircle, PauseCircle, CheckCircle, Ban } from 'lucide-react';

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

const statusConfig: Record<CampaignStatus, { label: string; className: string; icon: any }> = {
  ACTIVE: {
    label: 'Active',
    className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200',
    icon: PlayCircle
  },
  PAUSED: {
    label: 'Paused',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200',
    icon: PauseCircle
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200',
    icon: CheckCircle
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200',
    icon: Ban
  },
};

export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.CANCELLED;
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={cn('font-medium text-xs flex items-center gap-1.5 w-max', config.className)}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </Badge>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

interface FundraisingProgressProps {
  raised: string;
  target: string | null;
  className?: string;
}

export function FundraisingProgress({ raised, target, className }: FundraisingProgressProps) {
  const raisedNum = parseFloat(raised) || 0;
  const targetNum = target ? parseFloat(target) : null;

  const pct = targetNum && targetNum > 0
    ? Math.min(Math.round((raisedNum / targetNum) * 100), 100)
    : null;

  return (
    <div className={cn('space-y-1', className)}>
      {targetNum !== null && pct !== null ? (
        <>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{pct}% raised</span>
            <span className="font-medium text-gray-700">
              ₹{raisedNum.toLocaleString('en-IN')} / ₹{targetNum.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                pct >= 100 ? 'bg-green-500' : 'bg-blue-500'
              )}
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </>
      ) : (
        <span className="text-sm font-medium text-gray-700">
          ₹{raisedNum.toLocaleString('en-IN')} raised
        </span>
      )}
    </div>
  );
}
