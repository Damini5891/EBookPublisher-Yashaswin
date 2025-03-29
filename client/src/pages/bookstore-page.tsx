import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BookCard from "@/components/ui/book-card";
import SearchBooks from "@/components/ui/search-books";
import { BOOK_GENRES } from "@/lib/constants";
import { Book } from "@shared/schema";

const BookstorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filteredBooks = books.filter(book => {
    // Filter by search query (title)
    const matchesSearch = searchQuery 
      ? book.title.toLowerCase().includes(searchQuery.toLowerCase()) 
      : true;
    
    // Filter by genre if selected
    const matchesGenre = selectedGenre 
      ? book.genre === selectedGenre 
      : true;
    
    return matchesSearch && matchesGenre;
  });

  return (
    <>
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Merriweather', serif" }}>Bookstore</h1>
            <p className="text-xl mb-0">
              Discover the latest e-books from our talented authors
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="md:w-1/2">
              <SearchBooks onSearch={handleSearch} onFilter={toggleFilter} />
            </div>
            
            {isFilterOpen && (
              <div className="md:w-1/2 flex items-center justify-end gap-4">
                <div className="w-full md:w-48">
                  <Select value={selectedGenre} onValueChange={handleGenreChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Genres</SelectItem>
                      {BOOK_GENRES.map((genre) => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGenre("");
                  }}
                  className="whitespace-nowrap"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredBooks.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold" style={{ fontFamily: "'Merriweather', serif" }}>
                  {selectedGenre ? `${selectedGenre} Books` : "All Books"}
                </h2>
                <p className="text-neutral-600">
                  {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4"><i className="ri-book-open-line"></i></div>
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif" }}>No Books Found</h3>
              <p className="text-neutral-600 mb-6">
                {searchQuery 
                  ? "No books match your search criteria." 
                  : "There are currently no books in this category."}
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedGenre("");
              }}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-white" style={{ fontFamily: "'Merriweather', serif" }}>Never Miss a New Release</h2>
            <p className="text-lg text-white/90 mb-8">
              Subscribe to our newsletter to receive updates on new books, special offers, and author events.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 rounded-md focus:outline-none"
              />
              <Button className="px-6 py-3 bg-[#E94F37] text-white rounded-md font-medium hover:bg-[#C73623] transition-colors whitespace-nowrap">
                Subscribe
              </Button>
            </form>
            <p className="mt-4 text-sm text-white/70">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookstorePage;
