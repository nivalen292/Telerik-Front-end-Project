const init = (db) => {
    const objectId = require('mongodb').ObjectID;

    const getPosts = () => {
        return db.collection('thestyle-posts')
            .find()
            .toArray()
            .then((posts) => {
                return Promise.resolve(posts);
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