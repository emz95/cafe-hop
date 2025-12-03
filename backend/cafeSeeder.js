const mongoose = require('mongoose');

require('dotenv').config(); 

const Cafe = require('./models/Cafe');


//ai generated list of cafes 
const cafes = [
    // On-campus
    { name: 'Kerckhoff Coffee House' },
    { name: 'Bruin Café' },
    { name: 'The Study at Hedrick' },
    { name: 'Anderson Café' },
    { name: 'Jimmy’s Coffeehouse' },
    { name: 'Northern Lights' },
    { name: 'Southern Lights' },
    { name: 'Cafe 451' },
    { name: 'Bruin Buzz' },
    { name: 'Café Synapse' },
    { name: 'Café Med' },
    { name: 'Lollicup Fresh' },
  
    // Westwood Village
    { name: 'Espresso Profeta' },
    { name: 'Ministry of Coffee' },
    { name: 'Comoncy' },
    { name: 'Elysee Bakery & Cafe' },
    { name: 'Upside Down' },
    { name: 'Nuka Cafe' },
    { name: 'Brewin’ Coffee' },
    { name: 'Le Pain Quotidien' },
    { name: 'Mary & Robbs Westwood Cafe' },
    { name: 'Boondocks Coffee Roasters' },
    { name: 'Sipp Coffee House' },
    { name: 'Bluestone Lane – Westwood' },
    { name: 'Alfred Coffee (Westwood)' },
    { name: 'Espressoteric Coffee' },
    { name: 'Le Phant Milk Tea' },
  
    // Nearby West LA / Sawtelle
    { name: 'Bonsai Coffee Bar' },
    { name: 'The Landmark Cafe' },
    { name: '10 Speed Coffee' },
    { name: 'Coffee Tomo' },
    { name: 'Chitchat Coffee + Matcha' },
    { name: 'Dialog Cafe' },
    { name: 'Goodboybob Coffee Roasters' },
    { name: 'GoodPeople Coffee Co.' },
    { name: 'Motoring Coffee' },
    { name: 'Literati Cafe' },
  ];
  
  async function seedCafes() {
    await Cafe.deleteMany({});
    await Cafe.insertMany(cafes);
    return { count: cafes.length };
  }
  
  module.exports = seedCafes;