import query from "./common/query.js";

function createAdminsDb(sqlClient) {
  return {
    async findByLogin(login) {
      const sql = `SELECT * FROM admins WHERE login = $1`;
      const result = await query(sqlClient, sql, [login]);
      return result[0];
    },
  };
}

export default createAdminsDb;
