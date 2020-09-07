import client from './sanity';

export async function fetchAllTerms() {
  const query = `*[_type == "term"]`;
  const data = await client.fetch(query);
  return data;
}

export async function fetchTermBySlug(slug) {
  const query = `*[_type == "term" && slug.current ==$slug]`;
  const data = await client.fetch(query, { slug });
  return data[0];
}
