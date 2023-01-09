require('dotenv').config('../');

export default {
    APP: {
        PORT: Number(process.env.PORT) || 4001,
        HOST: process.env.HOST || '',
    },
    TRELLO: {
        URL: 'https://api.trello.com/1/',
    },
};
