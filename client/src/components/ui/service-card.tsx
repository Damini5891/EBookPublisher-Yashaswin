import { Card, CardContent } from "@/components/ui/card";

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => {
  return (
    <div className="p-6 bg-neutral-100 rounded-lg hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
        <i className={`${icon} text-2xl text-primary`}></i>
      </div>
      <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Merriweather', serif" }}>
        {title}
      </h3>
      <p className="text-neutral-800">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard;
