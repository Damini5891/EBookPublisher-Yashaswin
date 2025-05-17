import { users, books, manuscripts, orders, reviews, contacts, notifications } from "@shared/schema";
import type { 
  User, InsertUser, 
  Book, InsertBook, 
  Manuscript, InsertManuscript, 
  Order, InsertOrder, 
  Review, InsertReview, 
  Contact, InsertContact,
  Notification, InsertNotification
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<boolean>;
  
  // Book operations
  getBooks(): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  getBooksByAuthor(authorId: number): Promise<Book[]>;
  getBooksByGenre(genre: string): Promise<Book[]>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, updates: Partial<Book>): Promise<Book | undefined>;
  deleteBook(id: number): Promise<boolean>;
  
  // Manuscript operations
  getManuscripts(authorId: number): Promise<Manuscript[]>;
  getAllManuscripts(): Promise<Manuscript[]>;
  getManuscript(id: number): Promise<Manuscript | undefined>;
  createManuscript(manuscript: InsertManuscript): Promise<Manuscript>;
  updateManuscript(id: number, manuscript: Partial<InsertManuscript>): Promise<Manuscript | undefined>;
  deleteManuscript(id: number): Promise<boolean>;
  
  // Order operations
  getOrders(userId: number): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
  
  // Review operations
  getReviews(bookId: number): Promise<Review[]>;
  getAllReviews(): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  deleteReview(id: number): Promise<boolean>;
  
  // Contact operations
  getAllContacts(): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  deleteContact(id: number): Promise<boolean>;
  
  // Notification operations
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  getAllNotifications(): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  deleteNotification(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private books: Map<number, Book>;
  private manuscripts: Map<number, Manuscript>;
  private orders: Map<number, Order>;
  private reviews: Map<number, Review>;
  private contacts: Map<number, Contact>;
  private notifications: Map<number, Notification>;
  
  sessionStore: session.Store;
  
  private userCurrentId: number;
  private bookCurrentId: number;
  private manuscriptCurrentId: number;
  private orderCurrentId: number;
  private reviewCurrentId: number;
  private contactCurrentId: number;
  private notificationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.manuscripts = new Map();
    this.orders = new Map();
    this.reviews = new Map();
    this.contacts = new Map();
    this.notifications = new Map();
    
    this.userCurrentId = 1;
    this.bookCurrentId = 1;
    this.manuscriptCurrentId = 1;
    this.orderCurrentId = 1;
    this.reviewCurrentId = 1;
    this.contactCurrentId = 1;
    this.notificationCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Seed some initial books and admin users
    this.seedBooks();
    this.seedAdmins();
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
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      fullName: insertUser.fullName || null,
      bio: null,
      avatarUrl: null,
      isAuthor: false,
      isAdmin: false,
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
      id,
      title: insertBook.title,
      authorId: insertBook.authorId || null,
      authorName: null,
      description: insertBook.description || null,
      coverImage: insertBook.coverImage || null,
      price: insertBook.price,
      genre: insertBook.genre || null,
      publishedDate: now,
      rating: 0,
      reviewCount: 0,
      isDownloadable: true
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
      id,
      title: insertManuscript.title,
      authorId: insertManuscript.authorId || null,
      content: insertManuscript.content || null,
      status: insertManuscript.status || 'draft',
      coverDesign: insertManuscript.coverDesign || null,
      description: null,      // default value if not provided
      coverImage: null,       // default value if not provided
      genre: null,            // default value if not provided
      wordCount: 0,           // default value if not provided
      feedback: null,         // default value if not provided
      editorNotes: null,      // default value if not provided
      targetAudience: null,   // default value if not provided
      progressStage: null,    // default value if not provided
      estimatedCompletionDate: null, // default value if not provided
      createdAt: now,
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
      id,
      userId: insertOrder.userId || null,
      bookIds: insertOrder.bookIds || null,
      total: insertOrder.total,
      status: 'pending',
      totalAmount: insertOrder.total,
      paymentStatus: "pending",
      createdAt: now,
      items: []
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
      id,
      userId: insertReview.userId || null,
      bookId: insertReview.bookId || null,
      rating: insertReview.rating,
      comment: insertReview.comment || null,
      createdAt: now
    };
    this.reviews.set(id, review);
    
    // Update book rating
    if (review.bookId !== null) {
      const book = this.books.get(review.bookId);
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
    }
    
    return review;
  }

  // Contact operations
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactCurrentId++;
    const now = new Date();
    const contact: Contact = { 
      id,
      name: insertContact.name,
      email: insertContact.email,
      subject: insertContact.subject,
      message: insertContact.message,
      createdAt: now
    };
    this.contacts.set(id, contact);
    return contact;
  }

  // Admin methods
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { 
      ...user, 
      ...updates
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async updateBook(id: number, updates: Partial<Book>): Promise<Book | undefined> {
    const book = this.books.get(id);
    if (!book) return undefined;
    
    const updatedBook: Book = { 
      ...book, 
      ...updates
    };
    this.books.set(id, updatedBook);
    return updatedBook;
  }

  async deleteBook(id: number): Promise<boolean> {
    return this.books.delete(id);
  }

  async getAllManuscripts(): Promise<Manuscript[]> {
    return Array.from(this.manuscripts.values());
  }

  async deleteManuscript(id: number): Promise<boolean> {
    return this.manuscripts.delete(id);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async deleteOrder(id: number): Promise<boolean> {
    return this.orders.delete(id);
  }

  async getAllReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async deleteReview(id: number): Promise<boolean> {
    return this.reviews.delete(id);
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async deleteContact(id: number): Promise<boolean> {
    return this.contacts.delete(id);
  }

  // Notification operations
  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      (notification) => notification.userId === userId,
    );
  }

  async getAllNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values());
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationCurrentId++;
    const now = new Date();
    const notification: Notification = { 
      id,
      title: insertNotification.title,
      message: insertNotification.message,
      type: insertNotification.type || null,
      userId: insertNotification.userId || null,
      isRead: false,
      createdAt: now
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updatedNotification: Notification = { 
      ...notification, 
      isRead: true 
    };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  async deleteNotification(id: number): Promise<boolean> {
    return this.notifications.delete(id);
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
        reviewCount: Math.floor(Math.random() * 100) + 1, // Random number of reviews,
        authorName: `Author ${authorId}`,
        isDownloadable: true
      });
    });
  }

  // Seed admin users
  private seedAdmins() {
    // Create admin accounts
    const now = new Date();
    const adminUsers = [
      {
        id: this.userCurrentId++,
        username: 'admin',
        password: '6ba21fbbe66fa9935f5a1a2107c10cfeaad3dad8082bd2edeca6cb51f7343d41.f6d39775a44b6aa7f1541c61c8c76cd0', // "admin123"
        email: 'admin@pagecraft.com',
        fullName: 'Admin User',
        bio: 'System administrator',
        avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff',
        isAuthor: false,
        isAdmin: true,
        createdAt: now
      },
      {
        id: this.userCurrentId++,
        username: 'manager',
        password: '6ba21fbbe66fa9935f5a1a2107c10cfeaad3dad8082bd2edeca6cb51f7343d41.f6d39775a44b6aa7f1541c61c8c76cd0', // "admin123"
        email: 'manager@pagecraft.com',
        fullName: 'Content Manager',
        bio: 'Content and books manager',
        avatarUrl: 'https://ui-avatars.com/api/?name=Content+Manager&background=4B0082&color=fff',
        isAuthor: true,
        isAdmin: true,
        createdAt: now
      },
      {
        id: this.userCurrentId++,
        username: 'support',
        password: '6ba21fbbe66fa9935f5a1a2107c10cfeaad3dad8082bd2edeca6cb51f7343d41.f6d39775a44b6aa7f1541c61c8c76cd0', // "admin123"
        email: 'support@pagecraft.com',
        fullName: 'Support Team',
        bio: 'Customer support representative',
        avatarUrl: 'https://ui-avatars.com/api/?name=Support+Team&background=007000&color=fff',
        isAuthor: false,
        isAdmin: true,
        createdAt: now
      }
    ];

    // Add admin users to the store
    adminUsers.forEach(admin => {
      this.users.set(admin.id, admin);
    });
  }
}

export const storage = new MemStorage();
