async function seedAlbums(db) {
    const albums = [
        {
            title: 'Dawn Over City',
            artist: 'The Early Birds',
            releaseYear: 2018,
            genre: 'Indie Rock',
            label: 'Sunrise Records',
            trackCount: 10,
            duration: 3600,
            coverImageUrl: 'https://example.com/covers/dawn-over-city.jpg',
            description: 'Debut full-length from The Early Birds',
            isCompilation: false,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: 'Neon Nights',
            artist: 'Pulse Driver',
            releaseYear: 2021,
            genre: 'Synthwave',
            label: 'Neon Beats',
            trackCount: 9,
            duration: 3200,
            coverImageUrl: 'https://example.com/covers/neon-nights.jpg',
            description: 'Retro-futuristic synth album',
            isCompilation: false,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    const col = db.collection('albums');
    await col.deleteMany({});
    const result = await col.insertMany(albums);
    return result.insertedIds;
}

module.exports = seedAlbums;
