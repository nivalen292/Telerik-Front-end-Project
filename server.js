const async = () => {
    return Promise.resolve();
};

const { config } = require('./data/app/config');

async()
.then(() => require('./server/db').init(config.connectionString))
    .then((db) => require('./server/data').init(db))
    .then((data) => require('./server/app').init(data))
    .then((app) => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running at localhost:${process.env.PORT || 3000}`);
        });
    });