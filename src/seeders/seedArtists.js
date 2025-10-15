async function seedArtists(db) {
    const artists = [
        {
            name: 'The Early Birds',
            biography: 'An indie rock band known for jangly guitars and earnest lyrics.',
            genres: ['Indie Rock'],
            activeYears: '2015-present',
            country: 'USA',
            albums: ['Dawn Over City'],
            labels: ['Sunrise Records'],
            socialMedia: { twitter: '@earlybirds' },
            isActive: true,
            popularity: 62,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            name: 'Pulse Driver',
            biography: 'Synthwave artist blending retro synths with modern production.',
            genres: ['Synthwave', 'Electronic'],
            activeYears: '2018-present',
            country: 'UK',
            albums: ['Neon Nights'],
            labels: ['Neon Beats'],
            socialMedia: { instagram: '@pulsedriver' },
            isActive: true,
            popularity: 70,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    const col = db.collection('artists');
    await col.deleteMany({});
    const result = await col.insertMany(artists);
    return result.insertedIds;
}

module.exports = seedArtists;
