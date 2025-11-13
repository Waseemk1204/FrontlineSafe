import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ShieldCheckIcon, ClipboardCheckIcon, BellIcon, BarChart3Icon } from 'lucide-react';
export function Landing() {
  return <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-16 py-16 flex items-center justify-between">
          <h1 className="text-h2 font-bold text-primary">FrontlineSafe</h1>
          <div className="flex gap-12">
            <Link to="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button>Start Free Pilot</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-16 py-32 md:py-48 text-center">
        <h2 className="text-h1 md:text-4xl font-bold text-primary mb-16">
          Mobile-First HSE Incident & Inspection Management
        </h2>
        <p className="text-base md:text-lg text-neutral-600 mb-24 max-w-2xl mx-auto">
          Empower your frontline workers to report incidents, complete
          inspections, and track corrective actions—all from their mobile
          devices, even offline.
        </p>
        <Link to="/signup">
          <Button size="lg">Start Free Pilot</Button>
        </Link>
      </section>

      {/* Features */}
      <section className="bg-neutral-50 py-32 md:py-48">
        <div className="max-w-6xl mx-auto px-16">
          <h3 className="text-h2 font-bold text-center text-primary mb-32">
            Everything You Need for Frontline Safety
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-24">
            <FeatureCard icon={ShieldCheckIcon} title="Quick Incident Reporting" description="Workers report incidents in seconds with photos and location capture, even offline." />
            <FeatureCard icon={ClipboardCheckIcon} title="Mobile Inspections" description="Complete checklists and inspections from any device with customizable templates." />
            <FeatureCard icon={BellIcon} title="CAPA Tracking" description="Automatically create and track corrective actions with due dates and assignments." />
            <FeatureCard icon={BarChart3Icon} title="Real-Time Dashboards" description="Monitor KPIs, trends, and compliance metrics with exportable reports." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-16 py-32 md:py-48 text-center">
        <h3 className="text-h2 font-bold text-primary mb-16">
          Ready to Transform Your Safety Program?
        </h3>
        <p className="text-base text-neutral-600 mb-24 max-w-2xl mx-auto">
          Join leading organizations using FrontlineSafe to reduce incidents and
          improve safety culture.
        </p>
        <Link to="/signup">
          <Button size="lg">Start Free Pilot</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-24">
        <div className="max-w-6xl mx-auto px-16 text-center text-sm text-neutral-500">
          © 2024 FrontlineSafe. All rights reserved.
        </div>
      </footer>
    </div>;
}
function FeatureCard({
  icon: Icon,
  title,
  description
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-card mb-16">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h4 className="text-h3 font-semibold text-primary mb-8">{title}</h4>
      <p className="text-sm text-neutral-600">{description}</p>
    </div>;
}