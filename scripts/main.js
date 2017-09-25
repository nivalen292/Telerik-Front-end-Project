$(document).ready(() => {
    const app = Sammy('main', (router) => {
        router.get('#/', (data) => {
            console.log('home');
        });

        router.notFound = () => {
            console.log('404');
        }
    });
    app.run('#/');
});
