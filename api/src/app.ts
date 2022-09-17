import express from 'express';

// Routers
import OAUTH from '@routers/oauth';
import User from '@routers/user';

// Schedulers
import '@schedule/oAuthAuthorization';

const app = express();
app.use(express.json());

app.get('/', (request, response) => {
    response.status(200).json({
        ok: true,
    });
});

app.use('/oauth', OAUTH);
app.use('/user', User);

export { app };
