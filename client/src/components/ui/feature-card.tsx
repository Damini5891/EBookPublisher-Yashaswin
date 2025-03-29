import { Card, CardContent } from "@/components/ui/card";

interface FeatureProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}

const FeatureCard = ({ number, title, description, isLast = false }: FeatureProps) => {
  return (
    <div className="relative">
      <div className="bg-white p-6 rounded-lg shadow-md h-full">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 text-white font-bold">
          {number}
        </div>
        <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Merriweather', serif" }}>
          {title}
        </h3>
        <p className="text-neutral-800">
          {description}
        </p>
      </div>
      
      {!isLast && (
        <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
          <svg width="40" height="16" viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M39.7071 8.70711C40.0976 8.31658 40.0976 7.68342 39.7071 7.29289L33.3431 0.928932C32.9526 0.538408 32.3195 0.538408 31.9289 0.928932C31.5384 1.31946 31.5384 1.95262 31.9289 2.34315L37.5858 8L31.9289 13.6569C31.5384 14.0474 31.5384 14.6805 31.9289 15.0711C32.3195 15.4616 32.9526 15.4616 33.3431 15.0711L39.7071 8.70711ZM0 9H39V7H0V9Z" fill="#4B3F72"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default FeatureCard;
