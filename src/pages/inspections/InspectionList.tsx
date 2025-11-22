import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, ClipboardCheck } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../../lib/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const InspectionList = () => {
    const navigate = useNavigate();
    const { data: inspections, isLoading } = useQuery({
        queryKey: ['inspections'],
        queryFn: async () => {
            try {
                const { data } = await api.get('/inspections');
                return data;
            } catch (e) {
                return [];
            }
        },
    });

    return (
        <div className="space-y-4 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Inspections</h1>
                <Button size="sm" onClick={() => navigate('/inspections/new')}>
                    <Plus className="mr-1 h-4 w-4" /> Start
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center py-8 text-neutral-500">Loading...</div>
            ) : inspections?.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">No inspections found</div>
            ) : (
                <div className="space-y-3">
                    {inspections?.map((inspection: any) => (
                        <Card key={inspection.id}>
                            <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-50 p-2 rounded-full">
                                        <ClipboardCheck className="h-5 w-5 text-info" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{inspection.templateName || 'Safety Inspection'}</h3>
                                        <p className="text-sm text-neutral-500">
                                            {inspection.createdAt ? format(new Date(inspection.createdAt), 'MMM d, yyyy') : 'Unknown date'}
                                        </p>
                                        <div className="mt-2 flex items-center space-x-2">
                                            <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                                                {inspection.items?.length || 0} items
                                            </span>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                Completed
                                            </span>
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
