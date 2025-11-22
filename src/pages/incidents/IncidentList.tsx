import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../../lib/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const IncidentList = () => {
    const navigate = useNavigate();
    const { data: incidents, isLoading } = useQuery({
        queryKey: ['incidents'],
        queryFn: async () => {
            try {
                const { data } = await api.get('/incidents');
                return data;
            } catch (e) {
                return [];
            }
        },
    });

    return (
        <div className="space-y-4 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Incidents</h1>
                <Button size="sm" onClick={() => navigate('/incidents/new')}>
                    <Plus className="mr-1 h-4 w-4" /> New
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-8 text-neutral-500">Loading...</div>
            ) : incidents?.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">No incidents reported</div>
            ) : (
                <div className="space-y-3">
                    {incidents?.map((incident: any) => (
                        <Card key={incident.id} className="border-l-4 border-l-danger">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold capitalize">{incident.type}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${incident.severity === 'high' ? 'bg-red-100 text-red-800' :
                                                    incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                }`}>
                                                {incident.severity}
                                            </span>
                                        </div>
                                        <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                                            {incident.description}
                                        </p>
                                        <div className="text-xs text-neutral-400 mt-2">
                                            {incident.createdAt ? format(new Date(incident.createdAt), 'MMM d, yyyy h:mm a') : 'Just now'}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
