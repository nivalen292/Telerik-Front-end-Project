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

    const data = {
        getPosts,
    };

    return Promise.resolve(data);
};

module.exports = { init };