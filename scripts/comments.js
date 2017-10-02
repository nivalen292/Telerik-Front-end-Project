//    /posts/{{post.id}}/comments/-2
import { post as postRequest } from './requester';

const setProperUrl = (ev) => {
    const $this = $(ev.target);
    let $comment = $this.parent().parent().parent();

    if ($comment.parent().hasClass('subcomments')) {
        $comment = $comment.parent().parent();
    }

    let commentIndex = $('.comment').index($comment);
    if (commentIndex < 0) {
        commentIndex = -2;
    }
    window.sessionStorage.setItem('commentIndex', commentIndex);
}

const postComment = (ev) => {
    // const $this = $(ev.target);
    // let $comment = $this.parent().parent().parent();

    // if ($comment.parent().hasClass('subcomments')) {
    //     $comment = $comment.parent().parent();
    // }

    // let commentIndex = $('.comment').index($comment);
    // if (commentIndex < 0) {
    //     commentIndex = -2;
    // }
    const postId = +window.location.href.split('posts/')[1].split('/')[0];

    const data = {
        author: $('#form-nickname').val(),
        imageUrl: $('#form-avatarUrl').val(),
        content: $('#form-message').val()
    }

    // 'post' only works
    postRequest('http://localhost:3000/posts/' + postId + '/comments/' + window.sessionStorage.getItem('commentIndex'), data)
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

export { postComment, setProperUrl };