const SANITY_PID = process.env.NEXT_PUBLIC_SANITY_PID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const SANITY_TOKEN = process.env.NEXT_PUBLIC_SANITY_TOKEN;
const SANITY_URL = `https://${SANITY_PID}.api.sanity.io/v1/data/query/${SANITY_DATASET}/`;

function buildVariables(variables) {
  return Object.keys(variables)
    .map((key) => `$${key}="${variables[key]}"`)
    .join('&');
}

function fetchURL(query, variables) {
  let url = `${SANITY_URL}?query=${encodeURIComponent(query)}`;
  if (variables) {
    url += `&${buildVariables(variables)}`;
  }

  return url;
}

async function fetchAPI(query, { previewData, variables }: any = {}) {
  const res = await fetch(fetchURL(query, variables), {
    headers: {
      Authorization: `Bearer ${SANITY_TOKEN || ''}`,
    },
  });

  if (res.status !== 200) {
    console.log(await res.text());
    throw new Error('Failed to fetch API');
  }

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json.result;
}

export async function fetchAllTerms() {
  const query = `*[_type == 'term']`;
  const data = await fetchAPI(query);
  return data;
}

export async function fetchTermBySlug(slug) {
  const query = `*[_type == "term" && slug.current == $slug]`;
  const data = await fetchAPI(query, {
    variables: { slug },
  });

  return data[0];
}
