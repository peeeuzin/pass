import express from 'express';

// Routers
import OAUTH from '@routers/oauth';
import UserAuth from '@routers/user/auth';

const app = express();
app.use(express.json());

app.use('/oauth', OAUTH);
app.use('/user/auth', UserAuth);

export { app };
