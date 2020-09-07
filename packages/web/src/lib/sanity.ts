import sanityCient from '@sanity/client';

const options = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
};

const client = sanityCient(options);

export default client;
