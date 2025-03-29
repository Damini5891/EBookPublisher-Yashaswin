import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBooksProps {
  onSearch: (query: string) => void;
  onFilter: () => void;
}

const SearchBooks = ({ onSearch, onFilter }: SearchBooksProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="flex items-center space-x-4">
      <form onSubmit={handleSearch} className="relative flex-grow">
        <Input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"></i>
      </form>
      <Button
        type="button"
        variant="ghost"
        onClick={onFilter}
        className="text-primary hover:text-primary-dark"
      >
        <i className="ri-filter-3-line text-xl"></i>
      </Button>
    </div>
  );
};

export default SearchBooks;
