/* eslint-disable react/prop-types */
import { CheckCircle2, Gauge } from 'lucide-react';

const MetricPanel = ({ metrics, compact = false }) => {
  if (!metrics?.items?.length) return null;

  return (
    <div>
      <div className={`grid gap-3 ${compact ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
        {metrics.items.map((item) => {
          const isScope = item.kind === 'scope';
          const Icon = isScope ? CheckCircle2 : Gauge;
          return (
            <article
              key={`${item.value}-${item.label}`}
              className={`relative overflow-hidden rounded-2xl border p-5 ${isScope ? 'border-cyan-300/20 bg-cyan-300/[0.035]' : 'border-lime-300/20 bg-lime-300/[0.035]'}`}
            >
              <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${isScope ? 'via-cyan-300/60' : 'via-lime-300/60'} to-transparent`} />
              <div className="flex items-center justify-between gap-3">
                <span className={`text-[10px] font-semibold tracking-[0.12em] ${isScope ? 'text-cyan-200/70' : 'text-lime-200/70'}`}>
                  {isScope ? '已实现规模' : '首轮试点基准'}
                </span>
                <Icon size={15} className={isScope ? 'text-cyan-300/70' : 'text-lime-300/70'} />
              </div>
              <div className="mt-5 text-3xl font-semibold tracking-tight text-white">{item.value}</div>
              <h3 className="mt-2 text-sm font-medium text-gray-200">{item.label}</h3>
              <p className="mt-3 text-xs leading-6 text-gray-500">{item.detail}</p>
            </article>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-6 text-gray-500">{metrics.summary} “已实现规模”为当前系统与交付范围；“首轮试点基准”为接下来按统一口径持续采集、复盘和验收的门槛值。</p>
    </div>
  );
};

export default MetricPanel;
