import React from "react"

interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

interface CardHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

interface CardTitleProps {
  className?: string;
  children?: React.ReactNode;
}

interface CardContentProps {
  className?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className = "", children, ...props }) => {
  const cardStyle = `rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm ${className}`;
  
  return (
    <div className={cardStyle} {...props}>
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ className = "", children, ...props }) => {
  const headerStyle = `flex flex-col space-y-1.5 p-6 ${className}`;
  
  return (
    <div className={headerStyle} {...props}>
      {children}
    </div>
  );
};

const CardTitle: React.FC<CardTitleProps> = ({ className = "", children, ...props }) => {
  const titleStyle = `text-2xl font-semibold leading-none tracking-tight ${className}`;
  
  return (
    <h3 className={titleStyle} {...props}>
      {children}
    </h3>
  );
};

const CardContent: React.FC<CardContentProps> = ({ className = "", children, ...props }) => {
  const contentStyle = `p-6 pt-0 ${className}`;
  
  return (
    <div className={contentStyle} {...props}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardContent };