import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CameraIcon, MapPinIcon, XIcon } from 'lucide-react';
import { useToast } from '../ui/Toast';
interface QuickIncidentFormData {
  type: 'injury' | 'near-miss' | 'hazard' | '';
  severity: 'low' | 'medium' | 'high' | '';
  description: string;
  location: string;
  photos: File[];
}
export interface QuickIncidentFormProps {
  onSubmit?: (data: QuickIncidentFormData) => void;
  onCancel?: () => void;
}
export function QuickIncidentForm({
  onSubmit,
  onCancel
}: QuickIncidentFormProps) {
  const {
    showToast
  } = useToast();
  const [formData, setFormData] = useState<QuickIncidentFormData>({
    type: '',
    severity: '',
    description: '',
    location: '',
    photos: []
  });
  const [errors, setErrors] = useState<Partial<Record<keyof QuickIncidentFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (formData.photos.length + files.length > 5) {
      showToast('Maximum 5 photos allowed', 'error');
      return;
    }
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };
  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };
  const captureLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const {
          latitude,
          longitude
        } = position.coords;
        setFormData(prev => ({
          ...prev,
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        }));
        showToast('Location captured', 'success');
      }, () => {
        showToast('Unable to capture location', 'error');
      });
    }
  };
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof QuickIncidentFormData, string>> = {};
    if (!formData.type) newErrors.type = 'Incident type is required';
    if (!formData.severity) newErrors.severity = 'Severity is required';
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    // Simulate offline queue behavior
    const isOnline = navigator.onLine;
    setTimeout(() => {
      if (isOnline) {
        showToast('Incident reported successfully', 'success');
        onSubmit?.(formData);
      } else {
        showToast('Queued for sync when online', 'info');
        // In real implementation, save to IndexedDB here
        onSubmit?.(formData);
      }
      setIsSubmitting(false);
    }, 1000);
  };
  return <form onSubmit={handleSubmit} className="space-y-16">
      <div className="bg-accent bg-opacity-10 p-12 rounded-input">
        <p className="text-sm text-neutral-700">
          Report hazards or near-misses quickly — photos help.
        </p>
      </div>

      {/* Incident Type */}
      <div>
        <label className="block text-sm font-medium text-neutral-900 mb-8">
          Incident Type <span className="text-danger">*</span>
        </label>
        <div className="grid grid-cols-3 gap-8">
          {[{
          value: 'injury',
          label: 'Injury'
        }, {
          value: 'near-miss',
          label: 'Near Miss'
        }, {
          value: 'hazard',
          label: 'Hazard'
        }].map(type => <button key={type.value} type="button" onClick={() => setFormData(prev => ({
          ...prev,
          type: type.value as any
        }))} className={`py-12 px-8 rounded-button border-2 text-sm font-medium transition-colors ${formData.type === type.value ? 'border-primary bg-primary text-white' : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'}`}>
              {type.label}
            </button>)}
        </div>
        {errors.type && <p className="mt-4 text-sm text-danger">{errors.type}</p>}
      </div>

      {/* Severity */}
      <div>
        <label className="block text-sm font-medium text-neutral-900 mb-8">
          Severity <span className="text-danger">*</span>
        </label>
        <div className="grid grid-cols-3 gap-8">
          {[{
          value: 'low',
          label: 'Low',
          color: 'bg-success'
        }, {
          value: 'medium',
          label: 'Medium',
          color: 'bg-accent'
        }, {
          value: 'high',
          label: 'High',
          color: 'bg-danger'
        }].map(severity => <button key={severity.value} type="button" onClick={() => setFormData(prev => ({
          ...prev,
          severity: severity.value as any
        }))} className={`py-12 px-8 rounded-button border-2 text-sm font-medium transition-colors ${formData.severity === severity.value ? `${severity.color} border-transparent text-white` : 'border-neutral-200 text-neutral-700 hover:border-neutral-300'}`}>
              {severity.label}
            </button>)}
        </div>
        {errors.severity && <p className="mt-4 text-sm text-danger">{errors.severity}</p>}
      </div>

      {/* Description */}
      <Input label="What happened?" multiline rows={4} value={formData.description} onChange={e => setFormData(prev => ({
      ...prev,
      description: e.target.value
    }))} error={errors.description} placeholder="Describe the incident in detail..." required />

      {/* Location */}
      <div>
        <Input label="Location" value={formData.location} onChange={e => setFormData(prev => ({
        ...prev,
        location: e.target.value
      }))} placeholder="Enter location or capture GPS" />
        <button type="button" onClick={captureLocation} className="mt-8 flex items-center gap-8 text-sm text-primary hover:underline">
          <MapPinIcon className="w-4 h-4" />
          Capture current location
        </button>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-neutral-900 mb-8">
          Photos (up to 5)
        </label>

        {formData.photos.length > 0 && <div className="grid grid-cols-3 gap-8 mb-12">
            {formData.photos.map((photo, index) => <div key={index} className="relative aspect-square">
                <img src={URL.createObjectURL(photo)} alt={`Upload ${index + 1}`} className="w-full h-full object-cover rounded-input" />
                <button type="button" onClick={() => removePhoto(index)} className="absolute top-4 right-4 p-4 bg-white rounded-full shadow-md hover:bg-neutral-50" aria-label="Remove photo">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>)}
          </div>}

        {formData.photos.length < 5 && <label className="flex flex-col items-center justify-center py-24 px-16 border-2 border-dashed border-neutral-200 rounded-input hover:border-neutral-300 cursor-pointer transition-colors">
            <CameraIcon className="w-8 h-8 text-neutral-400 mb-8" />
            <span className="text-sm text-neutral-600">Tap to add photo</span>
            <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
          </label>}
      </div>

      {/* Actions */}
      <div className="flex gap-12 pt-16">
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel} fullWidth>
            Cancel
          </Button>}
        <Button type="submit" loading={isSubmitting} fullWidth>
          {isSubmitting ? 'Submitting...' : 'Report Incident'}
        </Button>
      </div>
    </form>;
}