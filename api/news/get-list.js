async function handle({ filter, start = 0, count = 10 }) {
  const result = await news.getList({ filter, pagination: { start, count } });
  return result.map((news) => ({
    ...news,
    publish_date: news.publish_date.toISOString(),
    image: news.image.toString("base64"),
  }));
}
