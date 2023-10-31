async function query(sqlClient, sql, args) {
  try {
    const result = await sqlClient.query(sql, args);
    return result.rows;
  } catch (error) {
    console.error(error);
  }
}

export default query;
