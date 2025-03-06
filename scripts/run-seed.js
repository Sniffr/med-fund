const seedDatabase = require('./seed-database');

seedDatabase()
  .then(success => {
    console.log('Database seeding script completed. Success:', success);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error during database seeding:', err);
    process.exit(1);
  });
