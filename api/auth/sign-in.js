async function handle({ login, password }, { client }) {
  const admin = await admins.findByLogin(login);
  if (!admin) throw errors.auth();
  const passwordsMatch = await hasher.compareHash(password, admin.password_hash);
  if (!passwordsMatch) throw errors.auth();
  client.setSession(login);
}
