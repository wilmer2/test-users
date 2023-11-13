// Mapping of environment variables in case they do not come
export const EnvConfiguration = () => ({
  rabbitmqPort: process.env.RABBITMQ_PORT || '5672',
  rabbitmqEndpoint: process.env.RABBITMQ_ENDPOINT || 'amqp://localhost',

  remoteApiUrl:
    process.env.REMOTE_API_URL || 'https://jsonplaceholder.typicode.com/users',
});
