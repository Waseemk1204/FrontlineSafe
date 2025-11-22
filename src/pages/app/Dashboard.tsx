import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AlertTriangleIcon, ClipboardCheckIcon, ListTodoIcon, TrendingUpIcon } from 'lucide-react';
export function Dashboard() {
  return <div className="p-16 md:p-24 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-24">
        <div>
          <h1 className="text-h1 font-bold text-primary mb-4">Dashboard</h1>
          <p className="text-sm text-neutral-600">Welcome back, Raj</p>
        </div>
        <Link to="/app/report">
          <Button>Report Incident</Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
        <KPICard icon={AlertTriangleIcon} label="Total Incidents (30d)" value="12" trend="-25%" trendPositive={true} />
        <KPICard icon={ListTodoIcon} label="Open CAPAs" value="8" trend="+2" trendPositive={false} />
        <KPICard icon={ClipboardCheckIcon} label="Inspections (30d)" value="45" trend="+12%" trendPositive={true} />
        <KPICard icon={TrendingUpIcon} label="Near-Miss Ratio" value="3.2" trend="+0.5" trendPositive={true} />
      </div>

      {/* Recent Activity */}
      <Card>
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-h3 font-semibold text-primary">
            Recent Activity
          </h2>
          <Link to="/app/incidents" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>

        <div className="space-y-12">
          <ActivityItem type="incident" title="Slip hazard reported in Warehouse North" user="Yusuf Ahmed" time="2 hours ago" severity="medium" />
          <ActivityItem type="inspection" title="Weekly safety inspection completed" user="Aisha Khan" time="5 hours ago" severity="low" />
          <ActivityItem type="capa" title="CAPA assigned: Install warning signage" user="Raj Patel" time="1 day ago" severity="high" />
        </div>
      </Card>
    </div>;
}
function KPICard({
  icon: Icon,
  label,
  value,
  trend,
  trendPositive
}: any) {
  return <Card hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-600 mb-4">{label}</p>
          <p className="text-h1 font-bold text-primary">{value}</p>
        </div>
        <div className="p-8 bg-accent bg-opacity-10 rounded-button">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      <div className="mt-12">
        <span className={`text-sm font-medium ${trendPositive ? 'text-success' : 'text-danger'}`}>
          {trend}
        </span>
        <span className="text-sm text-neutral-500 ml-4">vs last period</span>
      </div>
    </Card>;
}
function ActivityItem({
  type,
  title,
  user,
  time,
  severity
}: any) {
  const severityColors = {
    low: 'bg-success',
    medium: 'bg-accent',
    high: 'bg-danger'
  };
  return <div className="flex items-start gap-12 py-12 border-b border-neutral-100 last:border-0">
      <div className={`w-2 h-2 rounded-full mt-6 ${severityColors[severity]}`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-900">{title}</p>
        <p className="text-xs text-neutral-500 mt-4">
          {user} • {time}
        </p>
      </div>
    </div>;
}