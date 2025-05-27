
import React from 'react';

interface ProgressBarProps {
  progress: number | null;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  if (progress === null) {
    return null;
  }
  
  return (
    <div className="flex-1 mr-4">
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
