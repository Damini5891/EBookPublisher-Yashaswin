import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import Stripe from "stripe";
import { z } from "zod";
import { 
  insertContactSchema, 
  insertManuscriptSchema, 
  insertReviewSchema 
} from "@shared/schema";

// Use Stripe or placeholder for development
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

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
