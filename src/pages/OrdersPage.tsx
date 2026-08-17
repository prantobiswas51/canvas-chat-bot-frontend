import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService, { OrderRecord, OrderRecordStatus, OrderStats } from '@/services/orderService';
import Table, { Column } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import {
  Search,
  MessageSquare,
  Phone,
  MapPin,
  Filter,
  Calendar,
  Bot,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const PAGE_SIZE = 10;
const STATUS_FILTERS: Array<{ label: string; value: OrderRecordStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Cancelled', value: 'cancelled' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatMoney(value: string | undefined, currency: string): string {
  if (!value) return '—';
  const num = parseFloat(value);
  return `৳${num.toLocaleString()} ${currency}`;
}

const getStatusBadge = (status: OrderRecordStatus) => {
  switch (status) {
    case 'confirmed':
      return <Badge variant="success" size="sm" dot>Confirmed</Badge>;
    case 'cancelled':
      return <Badge variant="danger" size="sm" dot>Cancelled</Badge>;
    default:
      return <Badge variant="warning" size="sm" dot>Pending</Badge>;
  }
};

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderRecordStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<OrderStats | null>(null);

  // Debounce free-text search before hitting the API.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    orderService
      .list({ page, limit: PAGE_SIZE, search: search || undefined, status: selectedStatus === 'all' ? undefined : selectedStatus })
      .then((result) => {
        if (cancelled) return;
        setOrders(result.data);
        setTotal(result.total);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load orders from the server.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, search, selectedStatus]);

  useEffect(() => {
    orderService
      .stats()
      .then(setStats)
      .catch(() => {
        // Non-critical — the summary pills just stay blank if this fails.
      });
  }, [orders]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  const columns: Column<OrderRecord>[] = [
    {
      header: 'Order Reference',
      cell: (order) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-indigo-500 dark:text-indigo-400 block">{order.invoiceId}</span>
          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
            <Calendar className="w-3 h-3" />
            {formatDate(order.createdAt)}
          </span>
        </div>
      ),
    },
    {
      header: 'Customer Details',
      cell: (order) => (
        <div className="space-y-1 py-1 max-w-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{order.customerName}</span>
            {order.createdByAi ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded">
                <Bot className="w-3 h-3" /> AI
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">
                <User className="w-3 h-3" /> Manual
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Phone className="w-3 h-3 text-indigo-500 shrink-0" />
            <span className="font-mono">{order.phone}</span>
          </div>
          <div className="flex items-start gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
            <span className="line-clamp-1" title={order.address}>{order.address}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Ordered Product',
      cell: (order) => (
        <div className="text-xs space-y-0.5">
          <div>
            <span className="font-mono text-slate-800 dark:text-slate-300">{order.productSku}</span>{' '}
            <span className="font-mono text-indigo-500 dark:text-indigo-400">x{order.quantity}</span>
          </div>
          {order.notes && (
            <div className="text-[11px] text-slate-400 line-clamp-1" title={order.notes}>
              {order.notes}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Total Price',
      cell: (order) => (
        <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
          {formatMoney(order.totalPrice, order.currency)}
        </div>
      ),
    },
    {
      header: 'Order Status',
      cell: (order) => getStatusBadge(order.status),
    },
    {
      header: 'Chat Context',
      cell: (order) =>
        order.conversationId ? (
          <button
            onClick={() => navigate('/chat')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-indigo-400/60 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all cursor-pointer shadow-sm"
            title="View the conversation this order came from"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
            <span>View Chat</span>
          </button>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Orders</h1>
            <Badge variant="indigo" size="sm" dot>Live DB</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Orders placed manually or captured automatically by the AI bot from customer chats
          </p>
        </div>

        {/* Overview Stats */}
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-xs font-mono">
          <div className="px-3 border-r border-slate-300 dark:border-slate-800">
            <span className="text-slate-500 block text-[10px]">TOTAL ORDERS</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{stats?.total ?? total}</span>
          </div>
          <div className="px-3">
            <span className="text-slate-500 block text-[10px]">AI GENERATED</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{stats?.aiGenerated ?? '—'}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-100 dark:bg-slate-900/40 p-3 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search invoice, name, phone, address, SKU..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter Status:
          </span>
          {STATUS_FILTERS.map((status) => (
            <button
              key={status.value}
              onClick={() => {
                setSelectedStatus(status.value);
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedStatus === status.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Data Table */}
      <Table
        columns={columns}
        data={orders}
        keyExtractor={(order) => order.id}
        isLoading={isLoading}
        emptyText={search || selectedStatus !== 'all' ? 'No orders match your filters.' : 'No orders yet.'}
      />

      {/* Pagination Controls */}
      <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
        <span>
          {total === 0 ? 'No orders' : `Showing ${rangeStart}–${rangeEnd} of ${total} orders`}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isLoading}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-400/60 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Prev
          </button>

          <span className="font-mono px-2">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isLoading}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-400/60 transition-colors cursor-pointer"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
