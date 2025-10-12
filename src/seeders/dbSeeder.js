
const { connectToDb, getDb } = require('../config/db');
const seedLabels = require('./seedLabels');
const seedGenres = require('./seedGenres');
const seedAlbums = require('./seedAlbums');
const seedReviews = require('./seedReviews');
const seedArtists = require('./seedArtists');

/**
 * Models seeders 
 * Responsible Team Member: Julius Songopa
 */

async function run() {
    try {
        await connectToDb();
        const db = getDb();

        console.log('Seeding labels...');
        const labels = await seedLabels(db);
        console.log('Inserted labels:', labels);

        console.log('Seeding genres...');
        const genres = await seedGenres(db);
        console.log('Inserted genres:', genres);

        console.log('Seeding artists...');
        const artists = await seedArtists(db);
        console.log('Inserted artists:', artists);

        console.log('Seeding albums...');
        const artistIds = Object.values(artists || []);
        // Pass artistIds to associate albums with artists
        const albums = await seedAlbums(db, artistIds);
        console.log('Inserted albums:', albums);

        console.log('Seeding reviews...');
        // Get albumIds if albums exist
        const albumIds = Object.values(albums || {});
        if (albumIds.length > 0) {
            const reviews = await seedReviews(db, albumIds);
            console.log('Inserted reviews:', reviews);
        } else {
            const reviews = await seedReviews(db, []);
            console.log('Inserted reviews:', reviews);
        }
        console.log('Seeding complete');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed', err);
        process.exit(1);
    }
}

if (require.main === module) run();

module.exports = run;
