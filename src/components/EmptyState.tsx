
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  action?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg bg-muted/40",
        className
      )}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">{description}</p>
      {action && (
        <Button className="mt-6" onClick={action}>
          {actionLabel || "Empezar"}
        </Button>
      )}
    </div>
  );
}
