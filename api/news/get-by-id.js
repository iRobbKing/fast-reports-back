async function handle(id) {
  const item = await news.getById(id);
  return {
    ...item,
    publish_date: item.publish_date.toISOString(),
    image: item.image.toString("base64"),
  };
}
