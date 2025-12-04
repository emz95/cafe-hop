const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const seedCafes = require('../cafeSeeder');
const seedZootopiaData = require('../zootopiaSeeder');

// Reset database
router.post('/reset', async (req, res) => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    res.status(200).json({ message: "Database reset" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Seed cafes
router.post('/seed-cafes', async (req, res) => {
  try {
    const result = await seedCafes();
    res.json({
      message: "Cafes seeded",
      count: result.count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generated with AI, prompts in zootopiaSeeder.js
router.post('/seed-zootopia', async (req, res) => {
  try {
    const result = await seedZootopiaData();
    res.json({
      message: "Zootopia data seeded successfully",
      summary: result,
    });
  } catch (err) {
    console.error('Error in /test/seed-zootopia:', err);
    res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Generated with AI, prompts in zootopiaSeeder.js
router.post('/reset-and-seed', async (req, res) => {
  try {
    // Step 1: Reset database
    console.log('Resetting database...');
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    console.log('✓ Database reset complete');

    // Step 2: Seed cafes
    console.log('Seeding cafes...');
    const cafeResult = await seedCafes();
    console.log(`✓ Cafes seeded: ${cafeResult.count}`);

    // Step 3: Seed Zootopia data
    console.log('Seeding Zootopia data...');
    const zootopiaResult = await seedZootopiaData();
    console.log('✓ Zootopia data seeded');

    res.json({
      message: "Database reset and seeded successfully",
      summary: {
        cafes: cafeResult.count,
        zootopia: zootopiaResult
      }
    });
  } catch (err) {
    console.error('Error in /test/reset-and-seed:', err);
    res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router;

