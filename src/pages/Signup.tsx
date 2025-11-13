import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';
export function Signup() {
  const navigate = useNavigate();
  const {
    showToast
  } = useToast();
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      showToast('Account created successfully', 'success');
      navigate('/app/dashboard');
      setIsLoading(false);
    }, 1000);
  };
  return <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-24 px-16">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-h1 font-bold text-center text-primary mb-8">
          FrontlineSafe
        </h1>
        <h2 className="text-h3 text-center text-neutral-900 mb-24">
          Start your free pilot
        </h2>

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-16">
            <Input label="Company Name" value={formData.companyName} onChange={e => setFormData({
            ...formData,
            companyName: e.target.value
          })} required />

            <Input label="Your Name" value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} required />

            <Input label="Work Email" type="email" value={formData.email} onChange={e => setFormData({
            ...formData,
            email: e.target.value
          })} required autoComplete="email" />

            <Input label="Password" type="password" value={formData.password} onChange={e => setFormData({
            ...formData,
            password: e.target.value
          })} required helperText="Minimum 8 characters" autoComplete="new-password" />

            <Button type="submit" fullWidth loading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-24 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>;
}