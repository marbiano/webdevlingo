import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import DefaultErrorPage from 'next/error';
import PortableText from '@sanity/block-content-to-react';
import { fetchAllTerms, fetchTermBySlug } from '../../lib/api';
import { Term } from '../../lib/types';
import Layout from '../../components/Layout';
import styles from '../../styles/blocks.module.css';

interface PageProps {
  term?: Term;
}

const TermPage: React.FC<PageProps> = ({ term }) => {
  const router = useRouter();
  const { isFallback } = router;

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
          <PortableText blocks={term.definition} className={styles.blocks} />
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
    paths: terms.map((term) => ({
      params: { slug: term.slug.current },
    })),
    fallback: true,
  };
};

export default TermPage;
