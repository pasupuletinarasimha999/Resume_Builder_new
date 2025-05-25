'use client';

import { ResumeProvider } from '@/context/ResumeContext';
import ResumeBuilder from '@/components/ResumeBuilder';

export default function Home() {
  return (
    <ResumeProvider>
      <ResumeBuilder />
    </ResumeProvider>
  );
}
