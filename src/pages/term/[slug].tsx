import { useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import DefaultErrorPage from 'next/error';
import { fetchAllTerms, fetchTermBySlug } from '../../lib/api';
import { Term } from '../../lib/types';
import Layout from '../../components/Layout';
import Heart from '../../components/Heart';
import { useTerm } from '../../lib/hooks/use-term';
import client from '../../lib/sanity';

interface PageProps {
  term?: Term;
}

const normalizeSlug = (slug: string[] | string | undefined) =>
  Array.isArray(slug) ? slug[0] : slug;

const TermPage: React.FC<PageProps> = ({ term }) => {
  const [liked, setLiked] = useState(false);
  const router = useRouter();
  const { isFallback, query } = router;
  const { slug } = query;
  const realSlug = normalizeSlug(slug);

  const { useTermQuery, mutateLikes } = useTerm(normalizeSlug(realSlug));

  const { data: clientTerm, isLoading, isError } = useTermQuery();
  const [mutate] = mutateLikes(() => setLiked(true));

  const onLike = async () => {
    try {
      await mutate({ slug: realSlug, value: clientTerm.likes + 1 });
    } catch {
      // Uh oh, something went wrong
    }
  };

  if (isFallback) {
    return <div>Loading...</div>;
  }

  if (!term) {
    return <DefaultErrorPage statusCode={404} />;
  }

  console.log('ct', clientTerm);
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-16">
        <h1 className="text-4xl font-bold tracking-tight mb-8">{term.title}</h1>
        <div className="max-w-xl font-serif text-gray-800 leading-7">
          {term.text}
        </div>
        <div className="mt-8 flex">
          {clientTerm ? (
            <button
              onClick={!liked ? onLike : null}
              className="mr-2 focus:outline-none"
            >
              <Heart className={liked ? 'activeHeart' : 'heart'} />
            </button>
          ) : (
            <div className="mr-2">
              <Heart className={liked ? 'activeHeart' : 'heart'} />
            </div>
          )}
          <span className={liked ? 'text-black' : 'text-gray-600'}>
            {clientTerm?.likes || term.likes}
          </span>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const term = await fetchTermBySlug(Array.isArray(slug) ? slug[0] : slug);

  return {
    props: {
      term,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const terms = await fetchAllTerms();

  return {
    paths: Object.keys(terms).map((slug) => ({
      params: { slug },
    })),
    fallback: true,
  };
};

export default TermPage;
