import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  isAuthor: boolean("is_author").default(false),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  authorId: integer("author_id").references(() => users.id),
  authorName: text("author_name"),
  description: text("description"),
  coverImage: text("cover_image"),
  price: integer("price").notNull(),
  genre: text("genre"),
  publishedDate: timestamp("published_date").defaultNow(),
  rating: integer("rating").default(0),
  reviewCount: integer("review_count").default(0),
  isDownloadable: boolean("is_downloadable").default(true),
});

export const manuscripts = pgTable("manuscripts", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").references(() => users.id),
  title: text("title").notNull(),
  content: text("content"),
  description: text("description"),
  genre: text("genre"),
  wordCount: integer("word_count"),
  status: text("status").default("draft"),
  coverDesign: text("cover_design"),
  coverImage: text("cover_image"),
  feedback: text("feedback"),
  editorNotes: text("editor_notes"),
  targetAudience: text("target_audience"),
  progressStage: integer("progress_stage"),
  estimatedCompletionDate: timestamp("estimated_completion_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  bookIds: text("book_ids").array(),
  total: integer("total").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").default("pending"),
  paymentStatus: text("payment_status").default("pending"),
  items: jsonb("items"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  bookId: integer("book_id").references(() => books.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("info"), // info, warning, success, error
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
    email: true,
    fullName: true,
  })
  .extend({
    confirmPassword: z.string(),
  });

export const insertBookSchema = createInsertSchema(books).pick({
  title: true,
  authorId: true,
  description: true,
  coverImage: true,
  price: true,
  genre: true,
});

export const insertManuscriptSchema = createInsertSchema(manuscripts).pick({
  authorId: true,
  title: true,
  content: true,
  description: true,
  genre: true,
  wordCount: true,
  status: true,
  coverDesign: true,
  coverImage: true,
  targetAudience: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  bookIds: true,
  total: true,
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  userId: true,
  bookId: true,
  rating: true,
  comment: true,
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  message: true,
  type: true,
  isRead: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBook = z.infer<typeof insertBookSchema>;
export type InsertManuscript = z.infer<typeof insertManuscriptSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Login = z.infer<typeof loginSchema>;

export type User = typeof users.$inferSelect;
export type Book = typeof books.$inferSelect;
export type Manuscript = typeof manuscripts.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
