import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import WorkflowPipelineCard from './WorkflowPipelineCard';
import EfficiencyInsightCard from './EfficiencyInsightCard';
import PriorityAlertsCard from './PriorityAlertsCard';
import RevenueTrendCard from './RevenueTrendCard';
import PackingEfficiencyCard from './PackingEfficiencyCard';
import StatusDistributionCard from './StatusDistributionCard';
import RecentOrdersCard from './RecentOrdersCard';
import KPIBox from '../../ui/KPIBox';
import axiosInstance from '../../../../shared/api/axiosInstance';
import { getAxiosErrorMessage } from '../../../../utils/apiHelpers';

function formatCurrency(value) {
  return `${new Intl.NumberFormat('ru-RU').format(Number(value ?? 0))} UZS`;
}

function RevenueBreakdown({ revenue }) {
  const items = [
    { label: 'Оплачено', value: revenue?.paid ?? 0, dot: 'bg-white' },
    { label: 'Не оплачено', value: revenue?.unpaid ?? 0, dot: 'bg-blue-300/70' },
  ];

  return (
    <div className="min-w-[230px] rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-blue-100">
              <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
              <span>{item.label}</span>
            </div>

            <div className="text-sm font-semibold text-white">
              {formatCurrency(item.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrdersReportsDashboard({ selectedPeriod }) {
  const from = useMemo(
    () => (selectedPeriod?.from ? format(selectedPeriod.from, 'yyyy-MM-dd') : null),
    [selectedPeriod?.from]
  );

  const to = useMemo(
    () => (selectedPeriod?.to ? format(selectedPeriod.to, 'yyyy-MM-dd') : null),
    [selectedPeriod?.to]
  );

  const periodLabel = useMemo(() => {
    if (!selectedPeriod?.from && !selectedPeriod?.to) return 'Select period';
    if (selectedPeriod?.from && !selectedPeriod?.to) {
      return `${format(selectedPeriod.from, 'dd.MM.yyyy')} - ...`;
    }
    if (!selectedPeriod?.from && selectedPeriod?.to) {
      return `... - ${format(selectedPeriod.to, 'dd.MM.yyyy')}`;
    }

    return `${format(selectedPeriod.from, 'dd.MM.yyyy')} - ${format(
      selectedPeriod.to,
      'dd.MM.yyyy'
    )}`;
  }, [selectedPeriod?.from, selectedPeriod?.to]);

  const [summary, setSummary] = useState({
    totalRevenue: {
      total: 0,
      paid: 0,
      unpaid: 0,
    },
    totalOrders: 0,
    activeOrders: 0,
    readyOrders: 0,
    completedOrders: 0,
  });

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  useEffect(() => {
    if (!from || !to) {
      setSummary({
        totalRevenue: {
          total: 0,
          paid: 0,
          unpaid: 0,
        },
        totalOrders: 0,
        activeOrders: 0,
        readyOrders: 0,
        completedOrders: 0,
      });
      return;
    }

    const fetchSummary = async () => {
      try {
        setLoadingSummary(true);
        setSummaryError('');

        const res = await axiosInstance.get('/dashboard/orders/summary', {
          params: { from, to },
        });

        if (res.data?.code !== 0) {
          throw new Error(res.data?.message || 'Не удалось загрузить сводку');
        }

        const response = res.data?.response ?? {};

        setSummary({
          totalRevenue: {
            total: response.revenue?.total ?? 0,
            paid: response.revenue?.paid ?? 0,
            unpaid: response.revenue?.unpaid ?? 0,
            partiallyPaid: response.revenue?.partiallyPaid ?? 0,
          },
          totalOrders: response.totalOrders ?? 0,
          activeOrders: response.activeOrders ?? 0,
          readyOrders: response.readyOrders ?? 0,
          completedOrders: response.completedOrders ?? 0,
        });
      } catch (error) {
        setSummaryError(getAxiosErrorMessage(error));
        setSummary({
          totalRevenue: {
            total: 0,
            paid: 0,
            unpaid: 0,
          },
          totalOrders: 0,
          activeOrders: 0,
          readyOrders: 0,
          completedOrders: 0,
        });
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchSummary();
  }, [from, to]);

  return (
    <>
      {summaryError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {summaryError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <KPIBox
            title="Общий доход"
            value={loadingSummary ? '...' : formatCurrency(summary.totalRevenue.total)}
            subtitle={periodLabel}
            accent
          >
            {!loadingSummary && <RevenueBreakdown revenue={summary.totalRevenue} />}
          </KPIBox>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:col-span-8">
          <KPIBox
            title="Всего заказов"
            value={loadingSummary ? '...' : summary.totalOrders}
            subtitle={periodLabel}
          />
          <KPIBox
            title="Активные заказы"
            value={loadingSummary ? '...' : summary.activeOrders}
            subtitle="Processing now"
          />
          <KPIBox
            title="Готово к выдаче"
            value={loadingSummary ? '...' : summary.readyOrders}
            subtitle="Waiting for customer"
          />
          <KPIBox
            title="Завершено"
            value={loadingSummary ? '...' : summary.completedOrders}
            subtitle={periodLabel}
          />
        </div>
      </div>

      {/* <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-4">
          <WorkflowPipelineCard selectedPeriod={selectedPeriod} />
          <EfficiencyInsightCard selectedPeriod={selectedPeriod} />
        </div>

        <div className="xl:col-span-4">
          <PriorityAlertsCard selectedPeriod={selectedPeriod} />
        </div>
      </div> */}

      {/* <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <RevenueTrendCard selectedPeriod={selectedPeriod} />
        </div>

        <div className="grid gap-4 xl:col-span-4">
          <PackingEfficiencyCard selectedPeriod={selectedPeriod} />
          <StatusDistributionCard selectedPeriod={selectedPeriod} />
        </div>
      </div> */}

      <RecentOrdersCard selectedPeriod={selectedPeriod} />
    </>
  );
}