import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Calendar } from 'lucide-react';
import { api } from '../../lib/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const Reports = () => {
    const handleDownload = async (type: string) => {
        try {
            // In a real app, this would trigger a file download
            // For demo, we'll just show an alert or log
            const response = await api.get(`/exports/${type}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}-report.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            alert('Demo: Report download simulated.');
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold">Reports</h1>

            <div className="grid gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="font-medium">Incident Summary</h3>
                                <p className="text-sm text-neutral-500">All incidents for the current month</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownload('incidents')}>
                            <Download size={20} />
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-100 p-3 rounded-lg text-green-600">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h3 className="font-medium">Inspection Log</h3>
                                <p className="text-sm text-neutral-500">Completed inspections and checklists</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownload('inspections')}>
                            <Download size={20} />
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="font-medium">CAPA Report</h3>
                                <p className="text-sm text-neutral-500">Open and closed corrective actions</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDownload('capas')}>
                            <Download size={20} />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
