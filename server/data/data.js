const init = (db) => {
    const objectId = require('mongodb').ObjectID;

    const getPosts = (page) => {
        return db.collection('thestyle-posts')
            .find()
            .toArray()
            .then((posts) => {
                const postsLen = posts.length;
                const POSTS_PER_PAGE = 11;
                posts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
                const result = {
                    posts: posts,
                    maxPage: Math.ceil(postsLen / POSTS_PER_PAGE)
                };
                return Promise.resolve(result);
            })
    };

    const getPostById = (id) => {
        return db.collection('thestyle-posts')
            .findOne({'id': id})
            .then((post) => {
                return Promise.resolve(post);
            })
    };

    const data = {
        getPosts,
        getPostById
    };

    return Promise.resolve(data);
};

module.exports = { init };