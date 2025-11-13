import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';
export function Login() {
  const navigate = useNavigate();
  const {
    showToast
  } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      showToast('Login successful', 'success');
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
          Sign in to your account
        </h2>

        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-16">
            <Input label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />

            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-8 rounded" />
                <span className="text-sm text-neutral-700">Remember me</span>
              </label>
              <Link to="/reset" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth loading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-24 text-center">
            <p className="text-sm text-neutral-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Start free pilot
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>;
}