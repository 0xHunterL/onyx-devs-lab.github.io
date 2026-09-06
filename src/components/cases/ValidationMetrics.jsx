/* eslint-disable react/prop-types */
import { ArrowRight, TrendingUp } from 'lucide-react';

const ValidationMetrics = ({ items }) => {
  if (!items?.length) return null;

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-lime-300/20 bg-[#0b101c]">
      <div className="flex flex-col gap-2 border-b border-white/10 bg-lime-300/[0.035] px-6 py-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] text-lime-200/65">PILOT VALIDATION</p>
          <h3 className="mt-2 text-lg font-semibold text-white">试点前后对照结果</h3>
        </div>
        <p className="max-w-xl text-xs leading-6 text-gray-500">基于首轮试点样本形成观察值；后续按相同口径持续回填业务台账与系统日志。</p>
      </div>
      <div className="grid lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.label} className="border-b border-white/10 p-6 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-sm font-medium text-gray-200">{item.label}</h4>
              <span className="inline-flex items-center gap-1 rounded-full border border-lime-300/20 bg-lime-300/[0.07] px-2.5 py-1 text-xs font-semibold text-lime-200"><TrendingUp size={12} />{item.change}</span>
            </div>
            <div className="mt-6 flex items-end gap-3">
              <div>
                <div className="text-[10px] tracking-[0.12em] text-gray-600">试点前基线</div>
                <div className="mt-1 text-xl font-medium text-gray-500">{item.before}</div>
              </div>
              <ArrowRight size={17} className="mb-1.5 text-lime-300/50" />
              <div>
                <div className="text-[10px] tracking-[0.12em] text-lime-200/60">试点观察值</div>
                <div className="mt-1 text-3xl font-semibold text-white">{item.after}</div>
              </div>
            </div>
            <p className="mt-5 border-t border-white/5 pt-4 text-xs leading-6 text-gray-500">{item.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ValidationMetrics;
