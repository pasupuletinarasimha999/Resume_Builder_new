'use client';

import { useForm } from 'react-hook-form';
import type { PersonalInfo } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useCallback } from 'react';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onUpdate: (data: PersonalInfo) => void;
}

export function PersonalInfoForm({ data, onUpdate }: PersonalInfoFormProps) {
  const { register, watch, setValue, getValues } = useForm<PersonalInfo>({
    defaultValues: data
  });

  const watchedData = watch();
  const isInitialMount = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Debounced update function
  const debouncedUpdate = useCallback((newData: PersonalInfo) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onUpdate(newData);
    }, 300); // 300ms delay
  }, [onUpdate]);

  // Update parent component when form data changes, but skip on initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only update if the data has actually changed
    const currentData = JSON.stringify(data);
    const newData = JSON.stringify(watchedData);

    if (currentData !== newData) {
      debouncedUpdate(watchedData);
    }
  }, [watchedData, data, debouncedUpdate]);

  // Update form when external data changes (only if different)
  useEffect(() => {
    const currentValues = getValues();
    for (const [key, value] of Object.entries(data)) {
      const typedKey = key as keyof PersonalInfo;
      if (currentValues[typedKey] !== value) {
        setValue(typedKey, value);
      }
    }
  }, [data, setValue, getValues]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Personal Information
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              {...register('fullName')}
              placeholder="Enter your full name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="Enter your phone number"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register('location')}
              placeholder="Enter your location"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            {...register('summary')}
            placeholder="Write a brief professional summary..."
            rows={4}
            className="mt-1"
          />
        </div>
      </div>
    </Card>
  );
}
