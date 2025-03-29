import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `$${(price / 100).toFixed(2)}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getBookCoverFallback(title: string): string {
  // Generate a color based on the book title
  const hash = title.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const hue = Math.abs(hash % 360);
  const saturation = 70;
  const lightness = 60;
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function getRatingStars(rating: number): { filled: number, half: boolean, empty: number } {
  const filled = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - filled - (half ? 1 : 0);
  
  return { filled, half, empty };
}

export function getRandomSubset<T>(array: T[], size: number): T[] {
  if (size >= array.length) return [...array];
  
  const result = new Set<T>();
  const available = [...array];
  
  while (result.size < size && available.length > 0) {
    const randomIndex = Math.floor(Math.random() * available.length);
    result.add(available[randomIndex]);
    available.splice(randomIndex, 1);
  }
  
  return Array.from(result);
}
