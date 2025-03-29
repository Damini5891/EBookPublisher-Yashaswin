interface TestimonialCardProps {
  name: string;
  role: string;
  rating: number;
  text: string;
  image: string;
}

const TestimonialCard = ({ name, role, rating, text, image }: TestimonialCardProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex text-[#E94F37] mb-4">
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="ri-star-fill"></i>
        ))}
        {hasHalfStar && <i className="ri-star-half-fill"></i>}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <i key={`empty-${i}`} className="ri-star-line"></i>
        ))}
      </div>
      <p className="text-neutral-800 mb-6 italic">
        {text}
      </p>
      <div className="flex items-center">
        <img 
          src={image} 
          alt={`${name} portrait`} 
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-sm text-neutral-600">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
