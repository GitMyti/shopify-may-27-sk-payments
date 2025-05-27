
import React from 'react';

interface FooterProps {
  logo?: string; // Optional prop for logo URL
}

const Footer: React.FC<FooterProps> = ({ logo }) => {
  return (
    <footer className="border-t border-border mt-20">
      <div className="container max-w-6xl py-8 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          {logo && (
            <img 
              src={logo} 
              alt="Myti - Local is Mighty" 
              className="h-10 mr-3"
            />
          )}
          <p className="text-sm text-brand-neutral">
            Myti Shopify Orders to Shopkeeper Reports
          </p>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-brand-neutral hover:text-brand-secondary transition-colors">
            Help
          </a>
          <a href="#" className="text-sm text-brand-neutral hover:text-brand-secondary transition-colors">
            Privacy
          </a>
          <a href="#" className="text-sm text-brand-neutral hover:text-brand-secondary transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
