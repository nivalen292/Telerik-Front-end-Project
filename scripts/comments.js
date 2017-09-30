//    /posts/{{post.id}}/comments/-2

const postComment = (ev) => {
    const $this = $(ev.target);
    let $comment = $this.parent().parent().parent();

    if ($comment.parent().hasClass('subcomments')) {
        $comment = $comment.parent().parent();
    }

    let commentIndex = $('.comment').index($comment);
    if (commentIndex < 0) {
        commentIndex = -2;
    }
    const postId = +window.location.href.split('posts/')[1].split('/')[0];

    const data = {
        nickname: $('#form-nickname').value(),
        avatarUrl: $('#form-avatarUrl').value(),
        message: $('#form-message').value()
    }

    postRequest('http://localhost:3000/posts/' + postId + '/comments/' + commentIndex, data)
        .then(() => {
            getTemplate('selected-post')
                .then((template) => {
                    rawTemplate = template;
                    return getRequest('http://localhost:3000/posts/' + postId);
                })
                .then((post) => {
                    const compiledTemplate = Handlebars.compile(rawTemplate);
                    $('main').html(compiledTemplate({
                        post: post
                    }));
                });
        });
}

export { postComment };