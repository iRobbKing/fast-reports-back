import { Buffer } from "node:buffer";
import query from "./common/query.js";

async function getNewsImageId(sqlClient, id) {
  const imageIdSql = `SELECT image_id FROM news WHERE id = $1`;
  const [{ image_id }] = await query(sqlClient, imageIdSql, [id]);
  return image_id;
}

function createNewsDb(sqlClient) {
  return {
    async getById(id) {
      const sql = `
        SELECT news.id, news.title, news.content, news.publish_date, news_images.image
        FROM news 
        INNER JOIN news_images ON news.image_id = news_images.id 
        WHERE news.id = $1
      `;
      const result = await query(sqlClient, sql, [id]);
      return result[0];
    },

    async getList({ filter, pagination: { start, count } }) {
      const filterSql = filter ? `WHERE news.title LIKE '%${filter}%' OR news.content LIKE '%${filter}%'` : '';
      const sql = `
        SELECT news.id, news.title, news.content, news.publish_date, news_images.image
        FROM news
        INNER JOIN news_images ON news.image_id = news_images.id ${filterSql}
        WHERE news.publish_date <= now()
        OFFSET ${start}
        LIMIT ${count}
      `;
      return await query(sqlClient, sql);
    },

    async getCount() {
      const sql = `SELECT count(*) FROM news WHERE news.publish_date <= now()`;
      const [{ count }] = await query(sqlClient, sql);
      return count;
    },

    async create({ title, content, publish_date, image }) {
      const imageSql = `INSERT INTO news_images (image) VALUES ($1) RETURNING id`;
      const [{ id }] = await query(sqlClient, imageSql, [image]);
      const newsSql = `INSERT INTO news (title, content, publish_date, image_id) VALUES ($1, $2, $3, $4)`;
      await query(sqlClient, newsSql, [title, content, publish_date, id]);
    },

    async update({ id, title, content, publish_date, image }) {
      async function updateImage() {
        const imageId = await getNewsImageId(sqlClient, id);
        const imageSql = `UPDATE news_images SET image = $1 WHERE id = $2`;
        await query(sqlClient, imageSql, [image, imageId]);
      }
      async function updateNews() {
        const newsSql = `UPDATE news SET title = $1, content = $2, publish_date = $3 WHERE id = $4`;
        await query(sqlClient, newsSql, [title, content, publish_date, id]);
      }
      if (Buffer.byteLength(image)) await updateImage();
      await updateNews();
    },

    async delete(id) {
      async function deleteImage(id) {
        const imageSql = `DELETE FROM news_images WHERE id = $1`;
        await query(sqlClient, imageSql, [id])
      }
      async function deleteNews() {
        const sql = `DELETE FROM news WHERE id = $1`;
        await query(sqlClient, sql, [id]);
      }
      const imageId = await getNewsImageId(sqlClient, id);
      await deleteNews();
      await deleteImage(imageId);
    },
  };
}

export default createNewsDb;
