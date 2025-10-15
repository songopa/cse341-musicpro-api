async function seedLabels(db) {
    const labels = [
        {
            name: 'Sunrise Records',
            foundedYear: 1998,
            country: 'USA',
            headquarters: 'Nashville, TN',
            ceo: 'Alex Turner',
            website: 'https://sunriserecords.example.com',
            genres: ['Country', 'Folk'],
            description: 'Independent label focusing on Americana and country artists.'
        },
        {
            name: 'Neon Beats',
            foundedYear: 2005,
            country: 'UK',
            headquarters: 'London',
            ceo: 'S. Patel',
            website: 'https://neonbeats.example.com',
            genres: ['Electronic', 'Dance'],
            description: 'Electronic music label with a global roster.'
        }
    ];

    const col = db.collection('labels');
    await col.deleteMany({});
    const result = await col.insertMany(labels);
    return result.insertedIds;
}

module.exports = seedLabels;
