import app from './app';
import { env } from './utils';

const PORT = env.get('http.port');

app.listen(PORT, () => console.log(`listening on port ${PORT}`));