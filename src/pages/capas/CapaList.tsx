import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckSquare, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../../lib/api';
import { Card, CardContent } from '../../components/ui/Card';

export const CapaList = () => {
    const { data: capas, isLoading } = useQuery({
        queryKey: ['capas'],
        queryFn: async () => {
            try {
                const { data } = await api.get('/capas');
                return data;
            } catch (e) {
                return [];
            }
        },
    });

    return (
        <div className="space-y-4 pb-20">
            <h1 className="text-2xl font-bold">Tasks & CAPAs</h1>

            {isLoading ? (
                <div className="text-center py-8 text-neutral-500">Loading...</div>
            ) : capas?.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">No tasks assigned</div>
            ) : (
                <div className="space-y-3">
                    {capas?.map((capa: any) => (
                        <Card key={capa.id}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start space-x-3">
                                        <div className={`mt-1 p-1 rounded ${capa.status === 'Open' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                            }`}>
                                            <CheckSquare size={16} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{capa.title}</h3>
                                            <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                                                {capa.description}
                                            </p>
                                            <div className="flex items-center mt-2 text-xs text-neutral-500 space-x-3">
                                                <span className={`px-2 py-0.5 rounded-full ${capa.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-neutral-100'
                                                    }`}>
                                                    {capa.priority || 'Normal'}
                                                </span>
                                                {capa.dueDate && (
                                                    <span className="flex items-center">
                                                        <Clock size={12} className="mr-1" />
                                                        {format(new Date(capa.dueDate), 'MMM d')}
                                                    </span>
                                                )}
                                            </div>
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
