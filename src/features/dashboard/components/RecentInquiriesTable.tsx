import React from 'react';
import Table, { Column } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { RecentInquiry } from '@/types/dashboard';

const RECENT_INQUIRIES: RecentInquiry[] = [
  {
    id: '1',
    customerName: 'Tanvir Ahmed',
    channel: 'WhatsApp',
    topic: 'Art Consultation',
    status: 'ai_active',
    timeAgo: '2 mins ago',
  },
  {
    id: '2',
    customerName: 'Nusrat Jahan',
    channel: 'Messenger',
    topic: 'Bulk Order Handoff',
    status: 'human_moderator',
    timeAgo: '15 mins ago',
  },
  {
    id: '3',
    customerName: 'Sajid Hossain',
    channel: 'Instagram',
    topic: 'Inventory',
    status: 'resolved',
    timeAgo: '1 hour ago',
  },
  {
    id: '4',
    customerName: 'Ayesha Siddiqua',
    channel: 'WhatsApp',
    topic: 'Inventory',
    status: 'ai_active',
    timeAgo: '2 hours ago',
  },
];

export const RecentInquiriesTable: React.FC = () => {
  const columns: Column<RecentInquiry>[] = [
    {
      header: 'Customer',
      cell: (item) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-slate-200 block">{item.customerName}</span>
          <span className="text-[10px] text-slate-500 font-mono">{item.channel}</span>
        </div>
      ),
    },
    {
      header: 'Inquiry Topic',
      cell: (item) => (
        <Badge
          variant={
            item.topic === 'Bulk Order Handoff'
              ? 'danger'
              : item.topic === 'Art Consultation'
              ? 'brand'
              : 'info'
          }
          size="sm"
        >
          {item.topic}
        </Badge>
      ),
    },
    {
      header: 'Status',
      cell: (item) => (
        <Badge
          variant={
            item.status === 'ai_active'
              ? 'brand'
              : item.status === 'human_moderator'
              ? 'warning'
              : 'neutral'
          }
          size="sm"
          dot
        >
          {item.status === 'ai_active'
            ? 'AI Active'
            : item.status === 'human_moderator'
            ? 'Human Handoff'
            : 'Resolved'}
        </Badge>
      ),
    },
    {
      header: 'Time',
      accessorKey: 'timeAgo',
      className: 'text-right font-mono text-xs text-slate-500 dark:text-slate-400',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Live Customer Inquiries</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Real-time Stream</span>
      </div>
      <Table columns={columns} data={RECENT_INQUIRIES} keyExtractor={(item) => item.id} />
    </div>
  );
};

export default RecentInquiriesTable;
