async function handle({ filter, only_published, start = 0, count = 10 }) {
  const result = await news.getList({ only_published, filter, pagination: { start, count } });
  return result.map((news) => ({
    ...news,
    publish_date: news.publish_date.toISOString(),
    image: news.image.toString("base64"),
  }));
}
