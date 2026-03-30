import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5500;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

app.use(express.json());

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    completedSkills: { type: [String], default: [] },
    badges: { type: mongoose.Schema.Types.Mixed, default: {} },
    xp: { type: Number, default: 120 },
    streak: { type: Number, default: 1 },
    completedGigs: { type: Number, default: 0 },
    completedCourses: { type: Number, default: 0 },
    activeDays: { type: Number, default: 1 },
    activeDates: { type: [String], default: [] },
    lastActiveDate: { type: String, default: '' }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

function generateToken(user) {
  return jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
}

async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    completedSkills: user.completedSkills,
    badges: user.badges || {},
    xp: user.xp,
    streak: user.streak,
    completedGigs: user.completedGigs,
    completedCourses: user.completedCourses,
    activeDays: user.activeDays,
    activeDates: user.activeDates || [],
    lastActiveDate: user.lastActiveDate
  };
}

function ensureDbReady(res) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'Database unavailable. Please try again shortly.' });
    return false;
  }
  return true;
}

app.post('/api/auth/signup', async (req, res) => {
  try {
    if (!ensureDbReady(res)) return;

    const { name = '', email = '', password = '' } = req.body;
    if (!name.trim() || !email.trim() || password.length < 6) {
      return res.status(400).json({ message: 'Invalid signup payload' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      passwordHash,
      completedSkills: ['HTML & CSS'],
      badges: { 'HTML & CSS': 'Beginner' },
      xp: 120,
      streak: 1,
      completedGigs: 0,
      completedCourses: 1,
      activeDays: 1,
      activeDates: [new Date().toISOString().slice(0, 10)],
      lastActiveDate: new Date().toISOString().slice(0, 10)
    });

    const token = generateToken(user);
    return res.status(201).json({ token, user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Signup failed', detail: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    if (!ensureDbReady(res)) return;

    const { email = '', password = '' } = req.body;
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || password.length < 6) {
      return res.status(400).json({ message: 'Invalid login payload' });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: 'Account not found. Please sign up first.' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    return res.json({ token, user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', detail: error.message });
  }
});

app.get('/api/activity/me', auth, async (req, res) => {
  return res.json({ user: serializeUser(req.user) });
});

app.post('/api/activity/sync', auth, async (req, res) => {
  try {
    const {
      completedSkills,
      badges,
      xp,
      streak,
      completedGigs,
      completedCourses,
      activeDays,
      activeDates,
      lastActiveDate
    } = req.body;

    if (Array.isArray(completedSkills)) req.user.completedSkills = completedSkills;
    if (badges && typeof badges === 'object') req.user.badges = badges;
    if (Number.isFinite(xp)) req.user.xp = xp;
    if (Number.isFinite(streak)) req.user.streak = streak;
    if (Number.isFinite(completedGigs)) req.user.completedGigs = completedGigs;
    if (Number.isFinite(completedCourses)) req.user.completedCourses = completedCourses;
    if (Number.isFinite(activeDays)) req.user.activeDays = activeDays;
    if (Array.isArray(activeDates)) req.user.activeDates = activeDates;
    if (typeof lastActiveDate === 'string') req.user.lastActiveDate = lastActiveDate;

    await req.user.save();
    return res.json({ user: serializeUser(req.user) });
  } catch (error) {
    return res.status(500).json({ message: 'Sync failed', detail: error.message });
  }
});

app.use(express.static(__dirname));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (!MONGODB_URI) {
  console.warn('MONGODB_URI missing. Auth/activity API will fail until .env is configured.');
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`SkillBridge running at http://127.0.0.1:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
