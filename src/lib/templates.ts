import type { GenerationOptions } from "@/types";

export interface StarterTemplate {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
  /** The schema/description that pre-fills the generator input. */
  input: string;
  schemaType: GenerationOptions["schemaType"];
  entities: string[];
}

export const TEMPLATES: StarterTemplate[] = [
  {
    id: "ecommerce",
    name: "E-commerce",
    emoji: "🛒",
    category: "Retail",
    description: "Products, carts, orders, payments and customers.",
    schemaType: "english",
    entities: ["User", "Product", "Category", "Order", "Cart", "Payment"],
    input:
      "Build an e-commerce backend with users, products organized into categories, shopping carts, orders with line items, and payments. Products have name, price, stock and images. Orders track status and totals.",
  },
  {
    id: "blog",
    name: "Blog / CMS",
    emoji: "📝",
    category: "Content",
    description: "Posts, comments, categories and tags with authors.",
    schemaType: "english",
    entities: ["User", "Post", "Comment", "Category", "Tag"],
    input:
      "Create a blog backend with authors (users), posts that belong to a category and have many tags, and threaded comments. Posts have title, slug, body, cover image and published status.",
  },
  {
    id: "crm",
    name: "CRM",
    emoji: "🤝",
    category: "Sales",
    description: "Contacts, companies, deals and activities pipeline.",
    schemaType: "english",
    entities: ["User", "Contact", "Company", "Deal", "Activity"],
    input:
      "Generate a CRM backend with contacts belonging to companies, sales deals moving through pipeline stages, and activities (calls, emails, meetings) logged against contacts and deals.",
  },
  {
    id: "erp",
    name: "ERP",
    emoji: "🏭",
    category: "Enterprise",
    description: "Employees, departments, products, invoices and orders.",
    schemaType: "english",
    entities: ["User", "Employee", "Department", "Product", "Invoice", "Order"],
    input:
      "Build an ERP backend covering employees and departments, product catalog with inventory, purchase and sales orders, and invoices with line items and payment status.",
  },
  {
    id: "hospital",
    name: "Hospital",
    emoji: "🏥",
    category: "Healthcare",
    description: "Patients, doctors, appointments and prescriptions.",
    schemaType: "english",
    entities: ["Patient", "Doctor", "Appointment", "Department", "Prescription"],
    input:
      "Create a hospital management API with patients, doctors assigned to departments, appointments between patients and doctors, and prescriptions linked to appointments.",
  },
  {
    id: "school",
    name: "School",
    emoji: "🎓",
    category: "Education",
    description: "Students, teachers, courses, classes and grades.",
    schemaType: "english",
    entities: ["Student", "Teacher", "Course", "Class", "Grade"],
    input:
      "Generate a school management backend with students, teachers, courses, classes (a course taught by a teacher), enrollments and grades per student per class.",
  },
  {
    id: "inventory",
    name: "Inventory",
    emoji: "📦",
    category: "Operations",
    description: "Products, warehouses, stock, suppliers and orders.",
    schemaType: "english",
    entities: ["Product", "Warehouse", "Stock", "Supplier", "Order"],
    input:
      "Build an inventory management backend with products, suppliers, warehouses, stock levels per warehouse, and purchase orders that update stock on receipt.",
  },
  {
    id: "restaurant",
    name: "Restaurant POS",
    emoji: "🍽️",
    category: "Hospitality",
    description: "Menu items, orders, tables and reservations.",
    schemaType: "english",
    entities: ["MenuItem", "Order", "Table", "Reservation", "Customer"],
    input:
      "Create a restaurant POS backend with menu items grouped by category, dine-in tables, reservations, and orders containing menu items with quantities and a running total.",
  },
  {
    id: "finance",
    name: "Finance",
    emoji: "💰",
    category: "Fintech",
    description: "Accounts, transactions, budgets and categories.",
    schemaType: "english",
    entities: ["User", "Account", "Transaction", "Budget", "Category"],
    input:
      "Generate a personal finance backend with users, financial accounts, transactions categorized by type, monthly budgets per category, and balance calculations.",
  },
  {
    id: "task-manager",
    name: "Task Manager",
    emoji: "✅",
    category: "Productivity",
    description: "Projects, tasks, labels and comments.",
    schemaType: "english",
    entities: ["User", "Project", "Task", "Comment", "Label"],
    input:
      "Build a task management backend with projects owned by users, tasks with status, priority, due date and assignee, labels on tasks, and comments on tasks.",
  },
  {
    id: "hrms",
    name: "HRMS",
    emoji: "👥",
    category: "HR",
    description: "Employees, departments, leave, payroll, attendance.",
    schemaType: "english",
    entities: ["Employee", "Department", "Leave", "Payroll", "Attendance"],
    input:
      "Create an HRMS backend with employees assigned to departments, leave requests with approval workflow, monthly payroll records, and daily attendance tracking.",
  },
  {
    id: "sql-example",
    name: "SQL Schema",
    emoji: "🗄️",
    category: "Example",
    description: "A ready-made SQL DDL you can generate from directly.",
    schemaType: "sql",
    entities: ["User", "Post", "Comment"],
    input: `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`,
  },
];

export const PROMPT_EXAMPLES: string[] = [
  "Build an ERP backend.",
  "Create a hospital management API.",
  "Generate a CRM.",
  "Inventory management system.",
  "Restaurant POS.",
  "Task management app.",
  "Build a multi-tenant SaaS billing backend.",
  "Social media API with posts, follows and likes.",
];
