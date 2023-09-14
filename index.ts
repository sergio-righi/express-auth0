import app from './app';

import { env } from 'utils';

const PORT = env.PORT;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));