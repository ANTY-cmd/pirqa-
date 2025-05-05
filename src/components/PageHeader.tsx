
import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      <h1 className="text-3xl font-bold text-andes-terra">{title}</h1>
      {description && (
        <p className="mt-2 text-muted-foreground max-w-2xl">{description}</p>
      )}
      <div className="andean-pattern-divider mt-4 w-40"></div>
    </div>
  );
}
