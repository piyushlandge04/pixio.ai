import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('page-enter');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('page-exit');
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (transitionStage === 'page-exit') {
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('page-enter');
      }, 250);
      return () => clearTimeout(timeout);
    }
  }, [transitionStage, location]);

  useEffect(() => {
    if (transitionStage === 'page-enter') {
      const timeout = setTimeout(() => {
        setTransitionStage('page-enter-active');
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [transitionStage]);

  return (
    <div className={transitionStage}>
      {children}
    </div>
  );
};
