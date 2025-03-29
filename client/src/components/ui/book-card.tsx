import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Book } from "@shared/schema";
import { formatPrice, getRatingStars } from "@/lib/utils";

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const { id, title, authorId, description, coverImage, price, rating, reviewCount } = book;
  const { filled, half, empty } = getRatingStars(rating);

  return (
    <div className="group">
      <div className="relative aspect-[2/3] mb-4 rounded-lg overflow-hidden shadow-md transition-transform group-hover:scale-105">
        <img 
          src={coverImage} 
          alt={`Cover of ${title}`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/book/${id}`}>
            <button className="w-full py-2 bg-[#E94F37] text-white rounded-md font-medium hover:bg-[#C73623] transition-colors">
              View Details
            </button>
          </Link>
        </div>
      </div>
      <h3 className="text-lg font-bold" style={{ fontFamily: "'Merriweather', serif" }}>{title}</h3>
      <p className="text-sm text-neutral-600 mb-1">Author Name</p>
      <div className="flex items-center">
        <div className="flex text-[#E94F37]">
          {[...Array(filled)].map((_, i) => (
            <i key={`filled-${i}`} className="ri-star-fill"></i>
          ))}
          {half && <i className="ri-star-half-fill"></i>}
          {[...Array(empty)].map((_, i) => (
            <i key={`empty-${i}`} className="ri-star-line"></i>
          ))}
        </div>
        <span className="ml-2 text-sm text-neutral-600">{rating.toFixed(1)} ({reviewCount})</span>
      </div>
      <p className="text-primary font-bold mt-1">{formatPrice(price)}</p>
    </div>
  );
};

export default BookCard;
