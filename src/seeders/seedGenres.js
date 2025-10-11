async function seedGenres(db) {
    const genres = [
        {
            name: 'Indie Rock',
            description: 'Guitar-driven rock music from independent labels',
            originDecade: '1980s',
            parentGenre: null,
            characteristics: ['DIY ethic', 'angular guitars', 'introspective lyrics'],
            popularArtists: ['The Strokes', 'Arctic Monkeys'],
            subgenres: ['Lo-fi', 'Post-punk revival'],
            popularityScore: 78
        },
        {
            name: 'Synthwave',
            description: '1980s-inspired electronic music with retro synth sounds',
            originDecade: '2000s',
            parentGenre: 'Electronic',
            characteristics: ['synths', 'nostalgic', 'cinematic'],
            popularArtists: ['FM-84', 'The Midnight'],
            subgenres: ['Darksynth'],
            popularityScore: 65
        }
    ];

    const col = db.collection('genres');
    await col.deleteMany({});
    const result = await col.insertMany(genres);
    return result.insertedIds;
}

module.exports = seedGenres;
