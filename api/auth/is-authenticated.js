async function handle(_, { client }) {
  const sessionId = client.sessionId;
  const authenticated = Boolean(sessionId);
  return { authenticated };
}
