import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ClipboardCheck, CheckSquare, Activity } from 'lucide-react';
import { api } from '../../lib/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { data: metrics, isLoading } = useQuery({
        queryKey: ['metrics'],
        queryFn: async () => {
            // Mock data for now if API fails or returns 404
            try {
                const { data } = await api.get('/metrics');
                return data;
            } catch (e) {
                return {
                    kpis: {
                        openIncidents: 3,
                        pendingInspections: 2,
                        openCapas: 5,
                        nearMisses: 12
                    }
                };
            }
        },
    });

    const stats = [
        {
            label: 'Open Incidents',
            value: metrics?.kpis?.openIncidents || 0,
            icon: AlertTriangle,
            color: 'text-danger',
        },
        {
            label: 'Pending Inspections',
            value: metrics?.kpis?.pendingInspections || 0,
            icon: ClipboardCheck,
            color: 'text-info',
        },
        {
            label: 'Open Tasks',
            value: metrics?.kpis?.openCapas || 0,
            icon: CheckSquare,
            color: 'text-accent-dark',
        },
        {
            label: 'Near Misses',
            value: metrics?.kpis?.nearMisses || 0,
            icon: Activity,
            color: 'text-success',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-none shadow-sm">
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                            <div className="text-2xl font-bold">{isLoading ? '-' : stat.value}</div>
                            <div className="text-xs text-neutral-500 font-medium">{stat.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-neutral-900">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-3">
                    <Button
                        className="w-full justify-start h-12"
                        onClick={() => navigate('/incidents/new')}
                    >
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Report Incident
                    </Button>
                    <Button
                        variant="secondary"
                        className="w-full justify-start h-12"
                        onClick={() => navigate('/inspections/new')}
                    >
                        <ClipboardCheck className="mr-2 h-5 w-5" />
                        Start Inspection
                    </Button>
                </div>
            </div>
        </div>
    );
};
