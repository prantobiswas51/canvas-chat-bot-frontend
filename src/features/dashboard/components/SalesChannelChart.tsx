import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ChannelAnalytics } from '@/types/dashboard';

const MOCK_CHANNELS: ChannelAnalytics[] = [
  { channel: 'WhatsApp Store', conversations: 1420, conversions: 380, aiResolvedRate: 88 },
  { channel: 'FB Messenger', conversations: 980, conversions: 210, aiResolvedRate: 84 },
  { channel: 'Instagram DM', conversations: 760, conversions: 195, aiResolvedRate: 91 },
  { channel: 'Website Live Chat', conversations: 540, conversions: 160, aiResolvedRate: 94 },
];

export const SalesChannelChart: React.FC = () => {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Omnichannel AI Performance</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Conversations vs AI Auto-Resolution rate</p>
        </div>
        <Badge variant="brand" size="sm">
          Live Data
        </Badge>
      </div>

      <div className="space-y-3 pt-2">
        {MOCK_CHANNELS.map((item) => (
          <div key={item.channel} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-800 dark:text-slate-200">{item.channel}</span>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">{item.conversations} chats</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{item.aiResolvedRate}% AI Resolved</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-[#0B0A1C] h-2 rounded-full overflow-hidden flex border border-slate-200 dark:border-[#27264D]">
              <div
                className="bg-gradient-to-r from-[#F81B57] to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${item.aiResolvedRate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SalesChannelChart;
