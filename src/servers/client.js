const SESSION_ID_KEY = "session_id";
const EXPIRES = new Date(2025, 1);

export default class Client {
  #cookies;
  #path;

  constructor(cookies, requestCookies, path) {
    this.#cookies = cookies
    this.#path = path;
    this.sessionId = requestCookies[SESSION_ID_KEY];
  }

  setSession(sessionId) {
    this.#cookies.setCookie(SESSION_ID_KEY, sessionId, {
      httpOnly: true,
      expires: EXPIRES,
      path: this.#path,
    });
    this.sessionId = sessionId;
  }

  clearSession() {
    this.#cookies.clearCookie(SESSION_ID_KEY, { path: this.#path });
    this.sessionId = null;
  }
}
