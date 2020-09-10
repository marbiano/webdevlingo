import { useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import DefaultErrorPage from 'next/error';
import { fetchAllTerms, fetchTermBySlug, mutateTermLikes } from '../../lib/api';
import { Term } from '../../lib/types';
import Layout from '../../components/Layout';
import styles from '../../styles/blocks.module.css';
import Heart from '../../components/Heart';

interface PageProps {
  term?: Term;
}

const TermPage: React.FC<PageProps> = ({ term }) => {
  const [liked, setLiked] = useState(false);
  const router = useRouter();
  const { isFallback, query } = router;

  const onClick = async (e) => {
    e.stopPropagation();
    const slug = Array.isArray(query.slug) ? query.slug[0] : query.slug;
    await mutateTermLikes(slug, term.likes + 1);
    setLiked(true);
  };

  if (isFallback) {
    return <div>Loading...</div>;
  }

  if (!term) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-16">
        <h1 className="text-4xl font-bold tracking-tight mb-8">{term.title}</h1>
        <div className="max-w-xl font-serif text-gray-800 leading-7">
          {term.text}
        </div>
        <div className="mt-8 flex">
          <div onClick={onClick} className="mr-2">
            <Heart className={liked ? 'activeHeart' : 'heart'} />
          </div>
          {term.likes}
          {/* <button type="button" onClick={onClick}>
            Like
          </button>{' '} */}
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
