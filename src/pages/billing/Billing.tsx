import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, Check } from 'lucide-react';
import { api } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const Billing = () => {
    const { data: subscription, isLoading } = useQuery({
        queryKey: ['subscription'],
        queryFn: async () => {
            try {
                const { data } = await api.get('/billing/subscription');
                return data;
            } catch (e) {
                return { plan: 'Starter', status: 'active' }; // Fallback for demo
            }
        },
    });

    const handleUpgrade = async () => {
        try {
            const { data } = await api.post('/billing/create-checkout-session', {
                planId: 'pro-monthly',
            });
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (e) {
            alert('Billing integration requires Stripe keys. This is a demo.');
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-2xl font-bold">Subscription & Billing</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-medium">{subscription?.plan || 'Starter'} Plan</p>
                            <p className="text-sm text-neutral-500 capitalize">{subscription?.status || 'Active'}</p>
                        </div>
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            Active
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-2 border-transparent hover:border-primary transition-colors">
                    <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">Starter</h3>
                        <p className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal text-neutral-500">/mo</span></p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-center text-sm"><Check size={16} className="text-green-500 mr-2" /> 5 Users</li>
                            <li className="flex items-center text-sm"><Check size={16} className="text-green-500 mr-2" /> Basic Reporting</li>
                            <li className="flex items-center text-sm"><Check size={16} className="text-green-500 mr-2" /> 1GB Storage</li>
                        </ul>
                        <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                    </CardContent>
                </Card>

                <Card className="border-2 border-primary relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs px-2 py-1">POPULAR</div>
                    <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">Pro</h3>
                        <p className="text-3xl font-bold mb-4">$29<span className="text-sm font-normal text-neutral-500">/mo</span></p>
                        <ul className="space-y-2 mb-6">
                            <li className="flex items-center text-sm"><Check size={16} className="text-green-500 mr-2" /> Unlimited Users</li>
                            <li className="flex items-center text-sm"><Check size={16} className="text-green-500 mr-2" /> Advanced Analytics</li>
                            <li className="flex items-center text-sm"><Check size={16} className="text-green-500 mr-2" /> 100GB Storage</li>
                            <li className="flex items-center text-sm"><Check size={16} className="text-green-500 mr-2" /> Priority Support</li>
                        </ul>
                        <Button className="w-full" onClick={handleUpgrade}>Upgrade to Pro</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
