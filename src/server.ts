import { createApp } from './app';
import { env } from './shared/config';

const app = createApp();

app.listen(env.port, () => {
  console.log(`Servidor rodando em http://localhost:${env.port}`);
  console.log(`Documentação disponível em http://localhost:${env.port}/docs`);
});
