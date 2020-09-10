const API_URL = `https://webdevlingo.firebaseio.com/terms`;

async function fetchAPI(endpoint = '') {
  const res = await fetch(`${API_URL}${endpoint}.json`);
  if (res.status !== 200) {
    console.log(await res.text());
    throw new Error('Failed to fetch API');
  }

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json;
}

async function mutateAPI({ endpoint = '', method = 'PUT', data = {} }) {
  const res = await fetch(`${API_URL}${endpoint}.json`, {
    method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (res.status !== 200) {
    console.log(await res.text());
    throw new Error('Failed to mutate API');
  }

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to mutate API');
  }

  return json;
}

export async function fetchAllTerms() {
  const data = await fetchAPI();
  return data;
}

export async function fetchTermBySlug(slug) {
  const data = await fetchAPI(`/${slug}`);

  return data;
}

export async function mutateTermLikes({ slug, value }) {
  const data = await mutateAPI({
    endpoint: `/${slug}`,
    method: 'PATCH',
    data: { likes: value },
  });

  return data;
}
