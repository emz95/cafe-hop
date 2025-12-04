const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Post = require('./models/Post');
const Cafe = require('./models/Cafe');
const CafeReview = require('./models/CafeReview');
const seedCafes = require('./cafeSeeder');

// Zootopia-themed user data
// Generated with AI
const zootopiaUsers = [
  {
    username: 'jhopps',
    firstName: 'Judy',
    lastName: 'Hopps',
    email: 'jhopps@ucla.edu',
    password: 'carrot123',
    number: '555-0101',
    bio: 'First bunny cop in Zootopia! Love exploring new cafes and meeting new friends. Always up for a coffee adventure! 🐰☕'
  },
  {
    username: 'nwilde',
    firstName: 'Nick',
    lastName: 'Wilde',
    email: 'nwilde@ucla.edu',
    password: 'slyfox123',
    number: '555-0102',
    bio: 'Sly fox with a taste for the finer things. Coffee connoisseur and smooth talker. Let\'s grab a cup! 🦊'
  },
  {
    username: 'cbogo',
    firstName: 'Chief',
    lastName: 'Bogo',
    email: 'cbogo@ucla.edu',
    password: 'buffalo123',
    number: '555-0103',
    bio: 'Chief of Zootopia Police Department. When I\'m not keeping the city safe, I\'m exploring the best coffee spots. 🦬'
  },
  {
    username: 'gazelle',
    firstName: 'Gazelle',
    lastName: 'Gazelle',
    email: 'gazelle@ucla.edu',
    password: 'popstar123',
    number: '555-0104',
    bio: 'Pop star and coffee enthusiast! Love trying new cafes before my shows. Music and coffee - the perfect combo! 🦌✨'
  },
  {
    username: 'flash',
    firstName: 'Flash',
    lastName: 'Slothmore',
    email: 'flash@ucla.edu',
    password: 'slow123',
    number: '555-0105',
    bio: 'DMV employee who takes life... slowly. But when it comes to coffee, I\'m always ready for a new spot! 🦥'
  }
];

// Zootopia-themed posts
const generatePosts = (users) => {
  // Generated with AI
  const locations = [
    'Savanna Central',
    'Tundratown',
    'Rainforest District',
    'Little Rodentia',
    'Meadowlands',
    'Downtown Zootopia',
    'Palm Plaza',
    'The Grand Pangolin Arms'
  ];

  // Generated with AI
  const cafeNames = [
    'The Carrot Cup',
    'Savanna Central Coffee',
    'Tundratown Brew',
    'Gazelle\'s Espresso Bar',
    'The Hopps & Beans',
    'Rainforest Roasters',
    'Little Rodentia Café',
    'The Wilde Coffee House',
    'Meadowlands Mocha',
    'Pawpsicle Coffee Co.',
    'The Big Bad Bean',
    'Zootopia Central Café',
    'The Sloth\'s Slow Brew',
    'Bogo\'s Bold Coffee',
    'The Jumbeaux Café'
  ];

  // Generated with AI
  const postDescriptions = [
    'Planning a coffee trip here! Looking for some company - anyone want to join me? We can grab coffee and explore the area together!',
    'Heading to this cafe for a study session. Would love some study buddies to join! Bring your books and let\'s be productive together.',
    'Coffee adventure time! I\'m checking out this new spot and would love company. Perfect for anyone who wants to discover new cafes with me!',
    'Morning coffee run! Planning to get there around opening time. Anyone up for an early start? Let\'s grab the best pastries before they run out!',
    'Weekend cafe hopping! This place is on my list. Looking for fellow coffee enthusiasts to join - we can make a day of it!',
    'Need a break from work? I\'m planning a relaxing coffee trip here. Come join me for some good vibes and great coffee!',
    'Exploring this neighborhood and stopping by this cafe. Would love to meet new people - feel free to join if you\'re in the area!',
    'Coffee date anyone? I\'m planning to visit this spot and would love company. Perfect for catching up or making new friends!',
    'Study group forming! Planning to work on some projects at this cafe. Looking for motivated study partners to join me!',
    'Adventure time! Trying out this new cafe I\'ve been curious about. Anyone want to be my coffee exploration buddy?',
    'Chill vibes needed! Planning a relaxed afternoon at this cafe. Come join if you want to unwind and enjoy some good coffee!',
    'Coffee and conversation! Heading here for a casual meetup. Open to anyone who wants to chat over a cup of coffee!'
  ];

  const posts = [];
  
  // Calculate future dates within the current month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const todayDate = today.getDate();
  const daysRemainingInMonth = lastDayOfMonth - todayDate;
  
  // Create 2-3 posts per user
  users.forEach((user, userIndex) => {
    const numPosts = Math.floor(Math.random() * 2) + 2; // 2-3 posts per user
    
    for (let i = 0; i < numPosts; i++) {
      // Generate a random future date within the current month
      // Ensure at least 1 day in the future, but not past the end of the month
      let daysFromNow;
      if (daysRemainingInMonth > 0) {
        daysFromNow = Math.floor(Math.random() * daysRemainingInMonth) + 1;
      } else {
        // If we're on the last day of the month, use the last day
        daysFromNow = 0;
      }
      
      const date = new Date(currentYear, currentMonth, todayDate + daysFromNow);
      
      // Safety check: ensure we don't go past the end of the month
      if (date.getDate() > lastDayOfMonth) {
        date.setDate(lastDayOfMonth);
      }
      
      posts.push({
        author: user._id,
        cafeName: cafeNames[Math.floor(Math.random() * cafeNames.length)],
        description: postDescriptions[Math.floor(Math.random() * postDescriptions.length)],
        date: date,
        location: locations[Math.floor(Math.random() * locations.length)],
        isOpenToJoin: Math.random() > 0.5 // Randomly open or closed
      });
    }
  });

  return posts;
};

// Zootopia-themed reviews
const generateReviews = (users, cafes) => {
  // Generated with AI
  const reviewDescriptions = [
    'Absolutely love this place! The coffee is amazing and the staff is super friendly. Will definitely be back!',
    'Great atmosphere for studying. The wifi is reliable and the coffee keeps me energized all day.',
    'The latte art here is incredible! Plus, the pastries are fresh and delicious. Highly recommend!',
    'Found this gem while exploring the city. The coffee quality is top-notch and the vibe is perfect.',
    'Perfect spot for a morning coffee run. Quick service and consistently good drinks.',
    'Love the cozy interior here. Great place to catch up with friends or get some work done.',
    'The baristas really know their craft. Best espresso I\'ve had in a while!',
    'Amazing selection of drinks and the ambiance is just right. This is my new go-to spot!',
    'The coffee here is smooth and flavorful. Plus, the location is convenient for my daily commute.',
    'Great place to unwind. The music isn\'t too loud and the seating is comfortable.'
  ];

  const reviews = [];
  
  // Each user reviews 3-5 random cafes
  users.forEach((user) => {
    const numReviews = Math.floor(Math.random() * 3) + 3; // 3-5 reviews per user
    const shuffledCafes = [...cafes].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numReviews && i < shuffledCafes.length; i++) {
      const cafe = shuffledCafes[i];
      const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars (mostly positive)
      
      reviews.push({
        cafe: cafe._id,
        reviewer: user._id,
        rating: rating,
        description: reviewDescriptions[Math.floor(Math.random() * reviewDescriptions.length)],
        photos: [] // Empty photos array for now
      });
    }
  });

  return reviews;
};

async function seedZootopiaData() {
  try {
    // Connect to MongoDB if not already connected
    const readyState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    
    if (readyState === 0) {
      // Not connected, connect now
      await mongoose.connect(process.env.MONGODB_URI, {});
      console.log('MongoDB Connected');
    } else if (readyState === 1) {
      // Already connected
      console.log('MongoDB already connected');
    } else if (readyState === 2) {
      // Currently connecting, wait for connection
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('MongoDB connection timeout'));
        }, 10000); // 10 second timeout
        
        mongoose.connection.once('connected', () => {
          clearTimeout(timeout);
          resolve();
        });
        
        mongoose.connection.once('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
      console.log('MongoDB connection established');
    } else {
      // State 3 (disconnecting) - wait a bit and try to connect
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI, {});
        console.log('MongoDB Connected after disconnection');
      }
    }

    console.log('Starting Zootopia data seeding...');

    // Step 1: Seed cafes (using existing seeder)
    console.log('Seeding cafes...');
    await seedCafes();
    const cafes = await Cafe.find({});
    if (cafes.length === 0) {
      throw new Error('No cafes found after seeding. Cafe seeding may have failed.');
    }
    console.log(`✓ Seeded ${cafes.length} cafes`);

    // Step 2: Create or find Zootopia users (don't delete existing data)
    console.log('Creating or finding Zootopia users...');
    const createdUsers = [];
    for (const userData of zootopiaUsers) {
      // Check if user already exists
      let user = await User.findOne({ 
        $or: [
          { username: userData.username },
          { email: userData.email }
        ]
      });
      
      if (!user) {
        // User doesn't exist, create new one
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        
        user = await User.create({
          ...userData,
          password: hashedPassword
        });
        console.log(`  ✓ Created user: ${user.username} (${user.firstName} ${user.lastName})`);
      } else {
        console.log(`  ⊙ User already exists: ${user.username} (${user.firstName} ${user.lastName})`);
      }
      createdUsers.push(user);
    }
    console.log(`✓ Processed ${createdUsers.length} users`);

    // Step 3: Create posts (only for Zootopia users)
    console.log('Creating posts for Zootopia users...');
    const posts = generatePosts(createdUsers);
    const createdPosts = await Post.insertMany(posts);
    console.log(`✓ Created ${createdPosts.length} posts`);

    // Step 4: Create reviews (only for Zootopia users)
    console.log('Creating cafe reviews for Zootopia users...');
    const reviews = generateReviews(createdUsers, cafes);
    const createdReviews = await CafeReview.insertMany(reviews);
    console.log(`✓ Created ${createdReviews.length} reviews`);

    // Step 5: Update cafe ratings
    console.log('Updating cafe ratings...');
    for (const cafe of cafes) {
      await Cafe.calcAvgRating(cafe._id);
    }
    console.log('✓ Updated cafe ratings');

    console.log('\n🎉 Zootopia data seeding completed successfully!');
    console.log(`\nSummary:`);
    console.log(`  - Users: ${createdUsers.length}`);
    console.log(`  - Posts: ${createdPosts.length}`);
    console.log(`  - Reviews: ${createdReviews.length}`);
    console.log(`  - Cafes: ${cafes.length}`);

    return {
      users: createdUsers.length,
      posts: createdPosts.length,
      reviews: createdReviews.length,
      cafes: cafes.length
    };

  } catch (error) {
    console.error('Error seeding Zootopia data:', error);
    throw error;
  } finally {
    // Don't close connection if it was already open (e.g., from app)
    if (mongoose.connection.readyState === 1 && process.argv[1] && process.argv[1].includes('zootopiaSeeder')) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run if called directly
if (require.main === module) {
  seedZootopiaData()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = seedZootopiaData;

