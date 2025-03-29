import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  priceUnit: string;
  features: PricingFeature[];
  popular?: boolean;
  onSelect: () => void;
}

const PricingCard = ({ 
  name, 
  description, 
  price, 
  priceUnit, 
  features, 
  popular = false,
  onSelect
}: PricingCardProps) => {
  return (
    <div className={`${popular ? 'border-2 border-primary' : 'border border-neutral-200'} rounded-lg p-8 ${popular ? 'shadow-lg' : 'hover:shadow-lg'} transition-shadow relative`}>
      {popular && (
        <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>{name}</h3>
      <p className="text-neutral-600 mb-6">{description}</p>
      <div className="mb-6">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-neutral-600">/ {priceUnit}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            {feature.included ? (
              <>
                <i className="ri-check-line text-green-500 mt-1 mr-2"></i>
                <span>{feature.name}</span>
              </>
            ) : (
              <>
                <i className="ri-close-line text-neutral-400 mt-1 mr-2"></i>
                <span className="text-neutral-400">{feature.name}</span>
              </>
            )}
          </li>
        ))}
      </ul>
      <Button 
        onClick={onSelect}
        className={`w-full py-3 ${popular 
          ? 'bg-primary text-white hover:bg-primary/90' 
          : 'border border-primary text-primary hover:bg-primary hover:text-white'} transition-colors`}
      >
        Choose {name}
      </Button>
    </div>
  );
};

export default PricingCard;
