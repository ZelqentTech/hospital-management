import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("medsync.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('patient', 'doctor', 'admin')) NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    specialization TEXT,
    experience INTEGER,
    rating REAL DEFAULT 0,
    reviews_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    doctor_id INTEGER,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
    type TEXT,
    fee REAL,
    FOREIGN KEY(patient_id) REFERENCES users(id),
    FOREIGN KEY(doctor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS doctor_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doctor_id INTEGER,
    day_of_week TEXT,
    start_time TEXT,
    end_time TEXT,
    slot_duration INTEGER DEFAULT 15,
    is_available BOOLEAN DEFAULT 1,
    FOREIGN KEY(doctor_id) REFERENCES users(id)
  );
`);

// Seed Data (if empty)
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare("INSERT INTO users (name, email, role, password, avatar, specialization, experience, rating, reviews_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  
  // Admin
  insertUser.run("Dr. Sarah Smith", "admin@medsync.com", "admin", "password123", "https://lh3.googleusercontent.com/aida-public/AB6AXuCF1elRvwuAu2MC8eLsNLTX7aIaqmLJsT-2EcEJdIP_KSO92xaEsPLy0a97Pa_lWAhOGFZBczaSgiuTAZFulDJeM2pbmBIKuI4o611Fz8r_tDnTSoFBCTyDzyP3VDLg6mmIglW2jMlrp3VvksMPW3ILsxZEH3rpvyMBPmZtMV_dfWNWoB6FcSJKN4dIHgfO6Qg8MxKcW_5imC5d_-NkgVluCGBqG5h6qnT_Dt-Y-GFtbwwolpIMrtbFLXzhYYviWmoWE5Ra_72ZtMuU", null, null, null, null);
  
  // Doctors
  insertUser.run("Dr. Sarah Jenkins", "sarah.j@medsync.com", "doctor", "password123", "https://lh3.googleusercontent.com/aida-public/AB6AXuDLyRN506SKbRXQ5CeEpJOXL2XpPPku5sWw6gJo3PWOxTwkbt9gR5kB5-g4SWeswb220qhhgmz6iuoJlNfpY9r9h1o9haksc3k7cQMpEKAFwE-VEUZfVIeDd4Q1XSbEwTm0QXZ4EBK83UVqr4OonpnT4dEhtBMJW06m_TcAij4AjRkzT4Evop7YRq5i5QAPOpyqQai46OMrxQrtKojofYDzQcsHo3SHZqJ80TaUEFF35vzCTyT8lHzP0f4vYo0LapK36JsygyGxJ2OA", "Senior Cardiologist", 12, 4.8, 124);
  insertUser.run("Dr. Michael Chen", "michael.c@medsync.com", "doctor", "password123", "https://lh3.googleusercontent.com/aida-public/AB6AXuAkyjXS6XiKPhjmsMxhA0wMf_LRXiM27XI5Q1-ouRnnIVpFDq-NTiL2Rp_zeX6q450Ahe5ro1MW5AMblm8fEUrMl5RCD4w73KyufqPhSB1Koh3vWpl-sk2yR9hy0zlYkTRuK4g4VbY8JSNSpHX004qb7HseNk3VE4LaehguFT_yCIfEoW5jGPswfCZbmkoAlW1iuTNOqyqpweCzZlrDixsJGs-H44X7j1J8VUT9C-b6Gb9_1odyq99rve8X_2I4theYJfozyH-tw12i", "Cardiology Specialist", 8, 4.7, 89);
  insertUser.run("Dr. Elena Rodriguez", "elena.r@medsync.com", "doctor", "password123", "https://lh3.googleusercontent.com/aida-public/AB6AXuB8D0-iLn3XT8yO87tdksBupIFcQhWi1_3KI_8T5LHgsfClAB6EEkstpu6T8ty8tLihht42G7iYLyAEDxKqZMBARvIjQuPcL72_cWJX4T_ZKcXcZtVQspgqJUd20Pb-CWt9EMdT7qi_GFHOsry8dW9yh6nKekgEkjnlkL1CxqBfxidUqslO3MEcVGYNOw-izQucEmVIWUY_xrVrSdjYfBhO0IwWg1liVz4jbFEib_lBzOeltMn2Cl3cadASy1RltW8nUGtOZQSMBxuV", "Pediatrics Specialist", 15, 5.0, 210);
  insertUser.run("Dr. James Wilson", "james.w@medsync.com", "doctor", "password123", "https://picsum.photos/seed/doc4/200/200", "Neurology", 10, 4.9, 156);
  insertUser.run("Dr. Lisa Wong", "lisa.w@medsync.com", "doctor", "password123", "https://picsum.photos/seed/doc5/200/200", "Dermatology", 7, 4.6, 72);
  
  // Patient
  insertUser.run("Alex Johnson", "alex@example.com", "patient", "password123", "https://lh3.googleusercontent.com/aida-public/AB6AXuAOLoTTabb9sJ0TjHlM7GQUzXIfprciBUpGjZI_SGZNVK0WvTH_VyuSDaSdN-yMny5xJoWv-bpw5P0RMWvo52KCgClgKZjNHkZoPoOZGNLb2ERUqeREf3d8qkPik6rTzJOSscYVx3_X-yCBKQ-NaKfPwQg7-eB5T9L5FdznrnF10_6pmrZMYk8pqJ-93Vl_5br--IT2EEdvvuUgbPuIeR1kNaPqkUDwYGYy7Gce5mx8CFw0SVrE3akI1pWlaMjm-7wBGam1QmVrQeLI", null, null, null, null);
  insertUser.run("Jane Smith", "jane@example.com", "patient", "password123", "https://picsum.photos/seed/p2/200/200", null, null, null, null);

  // Initial Appointments
  const insertAppt = db.prepare("INSERT INTO appointments (patient_id, doctor_id, date, time, status, type, fee) VALUES (?, ?, ?, ?, ?, ?, ?)");
  insertAppt.run(6, 2, "2026-02-27", "10:00 AM", "confirmed", "Checkup", 150);
  insertAppt.run(6, 3, "2026-02-28", "02:30 PM", "pending", "Consultation", 200);
  insertAppt.run(7, 2, "2026-02-27", "11:15 AM", "completed", "Follow-up", 100);
  insertAppt.run(7, 4, "2026-03-01", "09:00 AM", "pending", "Consultation", 250);
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  const PORT = 3000;

  app.use(express.json());

  // Socket.io Connection
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    
    socket.on("join", (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // API Routes
  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/doctors", (req, res) => {
    const doctors = db.prepare("SELECT * FROM users WHERE role = 'doctor'").all();
    res.json(doctors);
  });

  app.get("/api/appointments", (req, res) => {
    const { userId, role } = req.query;
    let appointments;
    if (role === 'patient') {
      appointments = db.prepare(`
        SELECT a.*, u.name as doctor_name, u.specialization as department 
        FROM appointments a 
        JOIN users u ON a.doctor_id = u.id 
        WHERE a.patient_id = ?
      `).all(userId);
    } else if (role === 'doctor') {
      appointments = db.prepare(`
        SELECT a.*, u.name as patient_name 
        FROM appointments a 
        JOIN users u ON a.patient_id = u.id 
        WHERE a.doctor_id = ?
      `).all(userId);
    } else {
      appointments = db.prepare(`
        SELECT a.*, p.name as patient_name, d.name as doctor_name, d.specialization as department
        FROM appointments a
        JOIN users p ON a.patient_id = p.id
        JOIN users d ON a.doctor_id = d.id
      `).all();
    }
    res.json(appointments);
  });

  app.post("/api/appointments", (req, res) => {
    const { patient_id, doctor_id, date, time, type, fee } = req.body;
    const info = db.prepare("INSERT INTO appointments (patient_id, doctor_id, date, time, type, fee) VALUES (?, ?, ?, ?, ?, ?)")
      .run(patient_id, doctor_id, date, time, type, fee);
    
    const newAppointmentId = info.lastInsertRowid;
    const appointment = db.prepare(`
      SELECT a.*, p.name as patient_name, d.name as doctor_name, d.specialization as department
      FROM appointments a
      JOIN users p ON a.patient_id = p.id
      JOIN users d ON a.doctor_id = d.id
      WHERE a.id = ?
    `).get(newAppointmentId) as any;

    // Broadcast to doctor and admin
    io.to(`doctor_${doctor_id}`).emit("new_appointment", appointment);
    io.to("admin").emit("new_appointment", appointment);
    
    res.json({ id: newAppointmentId });
  });

  app.patch("/api/appointments/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE appointments SET status = ? WHERE id = ?").run(status, id);
    
    const appointment = db.prepare("SELECT * FROM appointments WHERE id = ?").get(id) as any;
    
    // Notify patient
    io.to(`patient_${appointment.patient_id}`).emit("appointment_updated", appointment);
    // Notify admin
    io.to("admin").emit("appointment_updated", appointment);

    res.json({ success: true });
  });

  app.get("/api/stats", (req, res) => {
    const totalRevenue = db.prepare("SELECT SUM(fee) as total FROM appointments WHERE status = 'completed'").get() as any;
    const totalAppointments = db.prepare("SELECT COUNT(*) as count FROM appointments").get() as any;
    const totalPatients = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'patient'").get() as any;
    const activeDoctors = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'doctor'").get() as any;
    
    res.json({
      revenue: totalRevenue.total || 0,
      appointments: totalAppointments.count,
      patients: totalPatients.count,
      doctors: activeDoctors.count
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
