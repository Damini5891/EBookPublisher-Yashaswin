import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import Stripe from "stripe";
import { z } from "zod";
import { 
  insertContactSchema, 
  insertManuscriptSchema, 
  insertReviewSchema,
  insertBookSchema,
  insertNotificationSchema
} from "@shared/schema";

// Use Stripe or placeholder for development
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia",
});

// Admin middleware to check if the user is an admin
const isAdmin = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          userId: req.user.id.toString()
        }
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Complete order after payment
  app.post("/api/complete-order", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { bookIds, total } = req.body;
      
      if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
        return res.status(400).json({ message: "Invalid book IDs" });
      }

      // Create an order in our system
      const order = await storage.createOrder({
        userId: req.user.id,
        bookIds,
        total
      });

      res.status(201).json(order);
    } catch (error: any) {
      console.error("Error completing order:", error);
      res.status(500).json({ message: "Error completing order: " + error.message });
    }
  });
  
  // Admin API Routes
  // Users management
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });
  
  app.get("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });
  
  app.patch("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUser(id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  });
  
  app.delete("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const success = await storage.deleteUser(id);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  });
  
  // Books management
  app.post("/api/admin/books", isAdmin, async (req, res) => {
    try {
      const validationResult = insertBookSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid book data",
          errors: validationResult.error.flatten()
        });
      }
      
      const book = await storage.createBook(validationResult.data);
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ message: "Error creating book" });
    }
  });
  
  app.patch("/api/admin/books/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }
      
      const book = await storage.getBook(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      const updatedBook = await storage.updateBook(id, req.body);
      res.json(updatedBook);
    } catch (error) {
      res.status(500).json({ message: "Error updating book" });
    }
  });
  
  app.delete("/api/admin/books/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }
      
      const success = await storage.deleteBook(id);
      if (!success) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json({ message: "Book deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting book" });
    }
  });
  
  // Manuscripts management
  app.get("/api/admin/manuscripts", isAdmin, async (req, res) => {
    try {
      const manuscripts = await storage.getAllManuscripts();
      res.json(manuscripts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching manuscripts" });
    }
  });
  
  app.delete("/api/admin/manuscripts/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid manuscript ID" });
      }
      
      const success = await storage.deleteManuscript(id);
      if (!success) {
        return res.status(404).json({ message: "Manuscript not found" });
      }
      
      res.json({ message: "Manuscript deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting manuscript" });
    }
  });
  
  // Orders management
  app.get("/api/admin/orders", isAdmin, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });
  
  app.patch("/api/admin/orders/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedOrder = await storage.updateOrderStatus(id, status);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Error updating order" });
    }
  });
  
  app.delete("/api/admin/orders/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const success = await storage.deleteOrder(id);
      if (!success) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting order" });
    }
  });
  
  // Reviews management
  app.get("/api/admin/reviews", isAdmin, async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });
  
  app.delete("/api/admin/reviews/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }
      
      const success = await storage.deleteReview(id);
      if (!success) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting review" });
    }
  });
  
  // Contact messages management
  app.get("/api/admin/contacts", isAdmin, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching contacts" });
    }
  });
  
  app.delete("/api/admin/contacts/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid contact ID" });
      }
      
      const success = await storage.deleteContact(id);
      if (!success) {
        return res.status(404).json({ message: "Contact not found" });
      }
      
      res.json({ message: "Contact deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting contact" });
    }
  });
  
  // Notifications management
  app.get("/api/admin/notifications", isAdmin, async (req, res) => {
    try {
      const notifications = await storage.getAllNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching notifications" });
    }
  });
  
  app.post("/api/admin/notifications", isAdmin, async (req, res) => {
    try {
      const validationResult = insertNotificationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid notification data",
          errors: validationResult.error.flatten()
        });
      }
      
      const notification = await storage.createNotification(validationResult.data);
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ message: "Error creating notification" });
    }
  });
  
  app.delete("/api/admin/notifications/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid notification ID" });
      }
      
      const success = await storage.deleteNotification(id);
      if (!success) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      res.json({ message: "Notification deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting notification" });
    }
  });
  
  // User notification endpoints
  app.get("/api/notifications", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const notifications = await storage.getNotificationsByUser(req.user.id);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching notifications" });
    }
  });
  
  app.patch("/api/notifications/:id/read", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid notification ID" });
      }
      
      const notification = await storage.markNotificationAsRead(id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Error marking notification as read" });
    }
  });

  // Books API
  app.get("/api/books", async (req, res) => {
    try {
      const books = await storage.getBooks();
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books" });
    }
  });

  app.get("/api/books/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }
      
      const book = await storage.getBook(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: "Error fetching book" });
    }
  });

  app.get("/api/books/genre/:genre", async (req, res) => {
    try {
      const genre = req.params.genre;
      const books = await storage.getBooksByGenre(genre);
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books by genre" });
    }
  });

  // Author's Books API
  app.get("/api/author/books", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const books = await storage.getBooksByAuthor(req.user.id);
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Error fetching author books" });
    }
  });

  // Manuscripts API
  app.get("/api/manuscripts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const manuscripts = await storage.getManuscripts(req.user.id);
      res.json(manuscripts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching manuscripts" });
    }
  });

  app.post("/api/manuscripts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const validationResult = insertManuscriptSchema.safeParse({
        ...req.body,
        authorId: req.user.id
      });
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid manuscript data",
          errors: validationResult.error.flatten()
        });
      }
      
      const manuscript = await storage.createManuscript(validationResult.data);
      res.status(201).json(manuscript);
    } catch (error) {
      res.status(500).json({ message: "Error creating manuscript" });
    }
  });

  app.patch("/api/manuscripts/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid manuscript ID" });
      }
      
      const manuscript = await storage.getManuscript(id);
      if (!manuscript) {
        return res.status(404).json({ message: "Manuscript not found" });
      }
      
      if (manuscript.authorId !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update this manuscript" });
      }
      
      const updatedManuscript = await storage.updateManuscript(id, req.body);
      res.json(updatedManuscript);
    } catch (error) {
      res.status(500).json({ message: "Error updating manuscript" });
    }
  });

  // Reviews API
  app.get("/api/books/:id/reviews", async (req, res) => {
    try {
      const bookId = parseInt(req.params.id);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }
      
      const reviews = await storage.getReviews(bookId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });

  app.post("/api/books/:id/reviews", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const bookId = parseInt(req.params.id);
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }
      
      const validationResult = insertReviewSchema.safeParse({
        ...req.body,
        userId: req.user.id,
        bookId
      });
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid review data",
          errors: validationResult.error.flatten()
        });
      }
      
      const review = await storage.createReview(validationResult.data);
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ message: "Error creating review" });
    }
  });

  // Orders API
  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const orders = await storage.getOrders(req.user.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  // Contact API
  app.post("/api/contact", async (req, res) => {
    try {
      const validationResult = insertContactSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid contact form data",
          errors: validationResult.error.flatten()
        });
      }
      
      const contact = await storage.createContact(validationResult.data);
      res.status(201).json({ message: "Message sent successfully", id: contact.id });
    } catch (error) {
      res.status(500).json({ message: "Error sending message" });
    }
  });

  // Payment API
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const { amount } = req.body;
      
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: "Valid amount is required" });
      }
      
      // If using a real Stripe key, create a payment intent
      let paymentIntent;
      if (stripeSecretKey.startsWith('sk_')) {
        paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "usd",
        });
        res.json({ clientSecret: paymentIntent.client_secret });
      } else {
        // For development without a real Stripe key
        res.json({ 
          clientSecret: "mock_client_secret_" + Date.now(),
          isMockPayment: true
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/complete-order", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const { bookIds, total } = req.body;
      
      if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
        return res.status(400).json({ message: "Book IDs are required" });
      }
      
      if (!total || typeof total !== 'number' || total <= 0) {
        return res.status(400).json({ message: "Valid total amount is required" });
      }
      
      const order = await storage.createOrder({
        userId: req.user.id,
        bookIds,
        total
      });
      
      // Update order status to completed (in a real app, this would happen after payment confirmation)
      const updatedOrder = await storage.updateOrderStatus(order.id, "completed");
      
      res.status(201).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Error completing order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
