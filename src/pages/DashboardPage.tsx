import React from 'react';
import MetricCard from '@/features/dashboard/components/MetricCard';
import SalesChannelChart from '@/features/dashboard/components/SalesChannelChart';
import RecentInquiriesTable from '@/features/dashboard/components/RecentInquiriesTable';
import { MessageSquare, Bot, ShoppingCart, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Overview Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time analytics for Canvas omnichannel AI chatbot & e-commerce store
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<MessageSquare className="w-4 h-4" />}
            onClick={() => navigate('/chat')}
          >
            Open Live Unified Inbox
          </Button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Conversations"
          value="3,700"
          changePercent={14.2}
          isPositive={true}
          icon={<MessageSquare className="w-5 h-5" />}
        />
        <MetricCard
          title="AI Auto-Resolved"
          value="89.4%"
          changePercent={6.8}
          isPositive={true}
          icon={<Bot className="w-5 h-5" />}
        />
        <MetricCard
          title="E-Store Revenue"
          value="৳428,900 BDT"
          changePercent={22.5}
          isPositive={true}
          icon={<ShoppingCart className="w-5 h-5" />}
        />
        <MetricCard
          title="Human Handoffs"
          value="42"
          changePercent={-18.4}
          isPositive={true}
          period="Decreased vs last week"
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      {/* Main Grid: Performance Chart & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChannelChart />
        <RecentInquiriesTable />
      </div>
    </div>
  );
};

export default DashboardPage;
