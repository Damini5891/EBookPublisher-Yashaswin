import { users, books, manuscripts, orders, reviews, contacts } from "@shared/schema";
import type { 
  User, InsertUser, 
  Book, InsertBook, 
  Manuscript, InsertManuscript, 
  Order, InsertOrder, 
  Review, InsertReview, 
  Contact, InsertContact
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Book operations
  getBooks(): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  getBooksByAuthor(authorId: number): Promise<Book[]>;
  getBooksByGenre(genre: string): Promise<Book[]>;
  createBook(book: InsertBook): Promise<Book>;
  
  // Manuscript operations
  getManuscripts(authorId: number): Promise<Manuscript[]>;
  getManuscript(id: number): Promise<Manuscript | undefined>;
  createManuscript(manuscript: InsertManuscript): Promise<Manuscript>;
  updateManuscript(id: number, manuscript: Partial<InsertManuscript>): Promise<Manuscript | undefined>;
  
  // Order operations
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Review operations
  getReviews(bookId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Contact operations
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private books: Map<number, Book>;
  private manuscripts: Map<number, Manuscript>;
  private orders: Map<number, Order>;
  private reviews: Map<number, Review>;
  private contacts: Map<number, Contact>;
  
  sessionStore: session.SessionStore;
  
  private userCurrentId: number;
  private bookCurrentId: number;
  private manuscriptCurrentId: number;
  private orderCurrentId: number;
  private reviewCurrentId: number;
  private contactCurrentId: number;

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.manuscripts = new Map();
    this.orders = new Map();
    this.reviews = new Map();
    this.contacts = new Map();
    
    this.userCurrentId = 1;
    this.bookCurrentId = 1;
    this.manuscriptCurrentId = 1;
    this.orderCurrentId = 1;
    this.reviewCurrentId = 1;
    this.contactCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Seed some initial books
    this.seedBooks();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      isAuthor: false,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Book operations
  async getBooks(): Promise<Book[]> {
    return Array.from(this.books.values());
  }

  async getBook(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }

  async getBooksByAuthor(authorId: number): Promise<Book[]> {
    return Array.from(this.books.values()).filter(
      (book) => book.authorId === authorId,
    );
  }

  async getBooksByGenre(genre: string): Promise<Book[]> {
    return Array.from(this.books.values()).filter(
      (book) => book.genre === genre,
    );
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const id = this.bookCurrentId++;
    const now = new Date();
    const book: Book = { 
      ...insertBook, 
      id, 
      publishedDate: now,
      rating: 0,
      reviewCount: 0
    };
    this.books.set(id, book);
    return book;
  }

  // Manuscript operations
  async getManuscripts(authorId: number): Promise<Manuscript[]> {
    return Array.from(this.manuscripts.values()).filter(
      (manuscript) => manuscript.authorId === authorId,
    );
  }

  async getManuscript(id: number): Promise<Manuscript | undefined> {
    return this.manuscripts.get(id);
  }

  async createManuscript(insertManuscript: InsertManuscript): Promise<Manuscript> {
    const id = this.manuscriptCurrentId++;
    const now = new Date();
    const manuscript: Manuscript = { 
      ...insertManuscript, 
      id, 
      submittedAt: now,
      updatedAt: now
    };
    this.manuscripts.set(id, manuscript);
    return manuscript;
  }

  async updateManuscript(id: number, updates: Partial<InsertManuscript>): Promise<Manuscript | undefined> {
    const manuscript = this.manuscripts.get(id);
    if (!manuscript) return undefined;
    
    const now = new Date();
    const updatedManuscript: Manuscript = { 
      ...manuscript, 
      ...updates,
      updatedAt: now
    };
    this.manuscripts.set(id, updatedManuscript);
    return updatedManuscript;
  }

  // Order operations
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId,
    );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderCurrentId++;
    const now = new Date();
    const order: Order = { 
      ...insertOrder, 
      id, 
      paymentStatus: "pending",
      createdAt: now
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = { 
      ...order, 
      paymentStatus: status 
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Review operations
  async getReviews(bookId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.bookId === bookId,
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewCurrentId++;
    const now = new Date();
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt: now
    };
    this.reviews.set(id, review);
    
    // Update book rating
    const book = this.books.get(insertReview.bookId);
    if (book) {
      const reviews = await this.getReviews(book.id);
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = Math.round(totalRating / reviews.length);
      
      this.books.set(book.id, {
        ...book,
        rating: avgRating,
        reviewCount: reviews.length
      });
    }
    
    return review;
  }

  // Contact operations
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactCurrentId++;
    const now = new Date();
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: now
    };
    this.contacts.set(id, contact);
    return contact;
  }

  // Seed initial data
  private seedBooks() {
    const genres = ['Fiction', 'Fantasy', 'Science Fiction', 'Romance', 'Mystery', 'Non-Fiction', 'Business'];
    const bookData = [
      {
        title: 'The Last Chapter',
        description: 'A thrilling novel about the final mysteries of a legendary author.',
        price: 999, // $9.99
        genre: 'Mystery',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Beyond The Horizon',
        description: 'An epic journey across galaxies in search of humanity\'s new home.',
        price: 1299, // $12.99
        genre: 'Science Fiction',
        coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Midnight Echo',
        description: 'A supernatural tale of whispers that come alive at the stroke of midnight.',
        price: 799, // $7.99
        genre: 'Fantasy',
        coverImage: 'https://images.unsplash.com/photo-1531901599143-df5010ab9498?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Silent Whispers',
        description: 'A woman discovers she can hear the thoughts of others, changing her life forever.',
        price: 1099, // $10.99
        genre: 'Fiction',
        coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'The Business of Success',
        description: 'Learn the principles that drive successful entrepreneurs and companies.',
        price: 1499, // $14.99
        genre: 'Business',
        coverImage: 'https://images.unsplash.com/photo-1460467820054-c87ab43e9b59?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Love in Paris',
        description: 'A passionate romance set against the backdrop of the city of lights.',
        price: 899, // $8.99
        genre: 'Romance',
        coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Ancient Mysteries',
        description: 'Explore the most enigmatic historical puzzles that still baffle experts.',
        price: 1199, // $11.99
        genre: 'Non-Fiction',
        coverImage: 'https://images.unsplash.com/photo-1551029506-0807df4e2031?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'The Detective\'s Dilemma',
        description: 'A complex case pushes a veteran detective to the edge of his abilities and ethics.',
        price: 999, // $9.99
        genre: 'Mystery',
        coverImage: 'https://images.unsplash.com/photo-1576872381149-7847515ce5d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    ];

    // Create books
    bookData.forEach((book, index) => {
      const id = this.bookCurrentId++;
      const authorId = index % 3 + 1; // Assign to one of 3 potential authors
      const now = new Date();
      const publishedDate = new Date(now.getTime() - Math.random() * 10000000000); // Random date in the past
      
      this.books.set(id, {
        id,
        authorId,
        title: book.title,
        description: book.description,
        coverImage: book.coverImage,
        price: book.price,
        genre: book.genre,
        publishedDate,
        rating: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
        reviewCount: Math.floor(Math.random() * 100) + 1, // Random number of reviews
      });
    });
  }
}

export const storage = new MemStorage();
