/**
 * Mentor Seed Script
 * Run: node server/seeds/seedMentors.js
 *
 * This will DELETE existing mentors and insert 6 fresh ones.
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const Mentor = require("../models/Mentor");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌  MONGO_URI not found in .env");
  process.exit(1);
}

const mentorData = [
  {
    name: "Priya Sharma",
    email: "priya.sharma@mentors.com",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Serial entrepreneur with 10+ years building consumer startups in India. Founded two successful e-commerce brands and passionate about helping first-generation entrepreneurs find their footing.",
    expertise: ["E-Commerce", "D2C Branding", "Digital Marketing", "Product Strategy"],
    industry: "E-Commerce",
    experience: "10+ years",
    rating: 4.9,
    totalReviews: 128,
    linkedIn: "https://linkedin.com",
    availability: "available",
    sessionPrice: 0,
    isVerified: true,
    isFeatured: true,
  },
  {
    name: "Rahul Mehta",
    email: "rahul.mehta@mentors.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Former Product Manager at a leading fintech company, now running a SaaS startup for SMBs. Specializes in lean startup methodology and product-market fit for early-stage founders.",
    expertise: ["SaaS", "Product Management", "Fintech", "B2B Sales"],
    industry: "Technology",
    experience: "8 years",
    rating: 4.8,
    totalReviews: 95,
    linkedIn: "https://linkedin.com",
    availability: "available",
    sessionPrice: 0,
    isVerified: true,
    isFeatured: true,
  },
  {
    name: "Aisha Patel",
    email: "aisha.patel@mentors.com",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "Food tech entrepreneur and business coach. Turned a home kitchen into a thriving cloud kitchen network. Expert in food business licensing, supply chain, and scaling local food brands.",
    expertise: ["Food Business", "Cloud Kitchen", "Supply Chain", "Franchising"],
    industry: "Food & Beverage",
    experience: "7 years",
    rating: 4.7,
    totalReviews: 74,
    linkedIn: "https://linkedin.com",
    availability: "available",
    sessionPrice: 0,
    isVerified: true,
    isFeatured: false,
  },
  {
    name: "Vikram Singh",
    email: "vikram.singh@mentors.com",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    bio: "Angel investor and startup advisor with exits in edtech and logistics. Guides founders on fundraising, pitch decks, and investor relations. Has mentored 50+ startups across India.",
    expertise: ["Fundraising", "Pitch Decks", "Angel Investment", "Growth Strategy"],
    industry: "Investment",
    experience: "12 years",
    rating: 4.9,
    totalReviews: 210,
    linkedIn: "https://linkedin.com",
    availability: "busy",
    sessionPrice: 0,
    isVerified: true,
    isFeatured: true,
  },
  {
    name: "Meera Krishnan",
    email: "meera.krishnan@mentors.com",
    avatar: "https://randomuser.me/api/portraits/women/25.jpg",
    bio: "Fashion & lifestyle brand consultant. Helped over 30 micro-entrepreneurs launch their Etsy and Instagram-based businesses. Expert in sustainable fashion, sourcing, and personal branding.",
    expertise: ["Fashion & Lifestyle", "Etsy & Instagram Selling", "Personal Branding", "Sourcing"],
    industry: "Fashion",
    experience: "6 years",
    rating: 4.6,
    totalReviews: 58,
    linkedIn: "https://linkedin.com",
    availability: "available",
    sessionPrice: 0,
    isVerified: true,
    isFeatured: false,
  },
  {
    name: "Arjun Nair",
    email: "arjun.nair@mentors.com",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg",
    bio: "Digital marketing strategist who has scaled multiple local service businesses through SEO, social media, and performance marketing. Passionate about zero-budget marketing tactics for micro-entrepreneurs.",
    expertise: ["SEO", "Social Media Marketing", "Performance Marketing", "Content Strategy"],
    industry: "Digital Marketing",
    experience: "9 years",
    rating: 4.8,
    totalReviews: 143,
    linkedIn: "https://linkedin.com",
    availability: "available",
    sessionPrice: 0,
    isVerified: true,
    isFeatured: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅  Connected to MongoDB");

    const deleted = await Mentor.deleteMany({});
    console.log(`🗑️   Deleted ${deleted.deletedCount} existing mentor(s)`);

    const inserted = await Mentor.insertMany(mentorData);
    console.log(`✅  Inserted ${inserted.length} mentor(s):`);
    inserted.forEach((m) => console.log(`   → ${m.name} (${m.industry})`));

    console.log("\n🎉  Mentor seed complete!");
  } catch (err) {
    console.error("❌  Seed error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌  Disconnected from MongoDB");
  }
}

seed();