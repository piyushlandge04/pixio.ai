import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [transitionStage, setTransitionStage] = useState('page-enter-active');

  useEffect(() => {
    setTransitionStage('page-enter');
    const timeout = setTimeout(() => {
      setTransitionStage('page-enter-active');
    }, 50);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div className={transitionStage}>
      {children}
    </div>
  );
};
