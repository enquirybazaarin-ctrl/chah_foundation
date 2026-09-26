import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DonationStatus, PaymentMethod } from '@/lib/types';
import { CheckCircle, Clock, XCircle, Ban, Undo } from 'lucide-react';

interface DonationStatusBadgeProps {
  status: DonationStatus;
}

const statusConfig: Record<DonationStatus, { label: string; className: string; icon: any }> = {
  SUCCESS: {
    label: 'Success',
    className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200',
    icon: CheckCircle
  },
  PENDING: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200',
    icon: Clock
  },
  FAILED: {
    label: 'Failed',
    className: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200',
    icon: XCircle
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200',
    icon: Ban
  },
  REFUNDED: {
    label: 'Refunded',
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200',
    icon: Undo
  },
};

export function DonationStatusBadge({ status }: DonationStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.FAILED;
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={cn('font-medium text-xs flex items-center gap-1.5 w-max', config.className)}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </Badge>
  );
}

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
}

const methodConfig: Record<PaymentMethod, { label: string; className: string }> = {
  ONLINE: {
    label: 'Online',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200',
  },
  CASH: {
    label: 'Cash',
    className: 'bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200',
  },
  CHEQUE: {
    label: 'Cheque',
    className: 'bg-teal-100 text-teal-800 hover:bg-teal-100 border-teal-200',
  },
  BANK_TRANSFER: {
    label: 'Bank Transfer',
    className: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100 border-indigo-200',
  },
  OTHER: {
    label: 'Other',
    className: 'bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200',
  },
};

export function PaymentMethodBadge({ method }: PaymentMethodBadgeProps) {
  const config = methodConfig[method] ?? methodConfig.OTHER;
  return (
    <Badge variant="outline" className={cn('font-medium text-xs', config.className)}>
      {config.label}
    </Badge>
  );
}
