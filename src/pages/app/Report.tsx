import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuickIncidentForm } from '../../components/forms/QuickIncidentForm';
import { ArrowLeftIcon } from 'lucide-react';
export function Report() {
  const navigate = useNavigate();
  const handleSubmit = (data: any) => {
    // In real implementation, this would save to API or IndexedDB
    console.log('Incident submitted:', data);
    navigate('/app/incidents');
  };
  return <div className="min-h-screen bg-neutral-50 pb-24">
      <div className="bg-white border-b border-neutral-100 px-16 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-8 text-primary hover:underline">
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-16 py-24">
        <h1 className="text-h1 font-bold text-primary mb-8">Report Incident</h1>
        <p className="text-base text-neutral-600 mb-24">
          Fill out the form below to report an incident, near-miss, or hazard.
          Your report will be submitted immediately or queued if offline.
        </p>

        <div className="bg-white rounded-card border border-neutral-100 p-16 md:p-24">
          <QuickIncidentForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>;
}