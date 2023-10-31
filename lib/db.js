import createAdminsDb from "./db/admins.js";
import createNewsDb from "./db/news.js";

function createDb(sqlClient) {
  return {
    admins: createAdminsDb(sqlClient),
    news: createNewsDb(sqlClient),
  };
}

export default createDb;
