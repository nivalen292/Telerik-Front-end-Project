const init = (db) => {
    const objectId = require('mongodb').ObjectID;

    const getPosts = (page) => {
        return db.collection('thestyle-posts')
            .find()
            .toArray()
            .then((posts) => {
                const postsLen = posts.length;
                const POSTS_PER_PAGE = 11;
                if (page) {
                    posts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
                }
                const result = {
                    posts: posts,
                    maxPage: Math.ceil(postsLen / POSTS_PER_PAGE)
                };
                return Promise.resolve(result);
            })
    };

    const getPostById = (id) => {
        return db.collection('thestyle-posts')
            .findOne({ 'id': id })
            .then((post) => {
                return Promise.resolve(post);
            })
    };

    const getPostByCategory = (category, page) => {
        return db.collection('thestyle-posts')
            .find({ 'category': category })
            .toArray()
            .then((posts) => {
                const postsLen = posts.length;
                const POSTS_PER_PAGE = 11;
                if (page) {
                    posts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
                }
                const result = {
                    posts: posts,
                    maxPage: Math.ceil(postsLen / POSTS_PER_PAGE)
                };
                return Promise.resolve(result);
            })
    };

    const postComment = (postId, commentIndex, comment) => {
        return getPostById(postId)
            .then((post) => {
                const oldPost = post;
                if (commentIndex === -2) {
                    return db.collection('thestyle-posts')
                        .update(
                        {
                            'id': postId
                        },
                        {
                            $push: {
                                'comments': comment
                            }
                        });
                    // post.comments.push(comment);
                }
                else {
                    return db.collection('thestyle-posts')
                        .update(
                        {
                            'id': postId
                        },
                        {
                            $push: {
                                ['comments.' + commentIndex + '.subComments']: comment
                            }
                        });
                    // post.comments[commentIndex].subComments.push(comment);
                }
                // return db.collection('thestyle-posts')
                //     .update(oldPost, post);
            })
    };

    const data = {
        getPosts,
        getPostById,
        postComment,
        getPostByCategory
    };

    return Promise.resolve(data);
};

module.exports = { init };