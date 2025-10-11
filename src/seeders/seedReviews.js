async function seedReviews(db, albumIds = []) {
    const reviews = [
        {
            albumId: albumIds[0] || null,
            userId: 'user123',
            rating: 5,
            reviewText: 'Amazing album with great production',
            datePosted: new Date().toISOString(),
            isVerified: true,
            likesCount: 12,
            isPublic: true
        },
        {
            albumId: albumIds[1] || albumIds[0] || null,
            userId: 'user456',
            rating: 4,
            reviewText: 'Very enjoyable, a few filler tracks',
            datePosted: new Date().toISOString(),
            isVerified: false,
            likesCount: 3,
            isPublic: true
        }
    ];

    const col = db.collection('reviews');
    await col.deleteMany({});
    const result = await col.insertMany(reviews);
    return result.insertedIds;
}

module.exports = seedReviews;
