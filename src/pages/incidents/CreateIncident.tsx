import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { api } from '../../lib/api';
import { addToQueue } from '../../lib/offlineQueue';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

export const CreateIncident = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        type: 'hazard',
        severity: 'low',
        description: '',
        siteId: 'default-site', // TODO: Fetch sites
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            if (!navigator.onLine) {
                // Offline mode
                const offlineData = {
                    ...data,
                    clientTempId: uuidv4(),
                    createdAt: new Date().toISOString(),
                };
                await addToQueue({
                    url: '/incidents',
                    method: 'POST',
                    data: offlineData,
                });
                return offlineData;
            }

            // Online mode
            const { data: response } = await api.post('/incidents', data);
            return response;
        },
        onSuccess: () => {
            navigate('/incidents');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            ...formData,
            companyId: user?.companyId,
            reporterId: user?.id,
            reporterName: user?.name,
        });
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Report Incident</h1>
            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                                className="w-full rounded-input border border-neutral-300 p-2 bg-white"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="hazard">Hazard</option>
                                <option value="near-miss">Near Miss</option>
                                <option value="injury">Injury</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Severity</label>
                            <select
                                className="w-full rounded-input border border-neutral-300 p-2 bg-white"
                                value={formData.severity}
                                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                className="w-full rounded-input border border-neutral-300 p-2 min-h-[100px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                placeholder="Describe what happened..."
                            />
                        </div>

                        <Button type="submit" className="w-full" isLoading={createMutation.isPending}>
                            Submit Report
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
