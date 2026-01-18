import { memo } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

// Simplified page transition - no animation overhead
export const PageTransition = memo(({ children }: PageTransitionProps) => {
  return <>{children}</>;
});

PageTransition.displayName = "PageTransition";
