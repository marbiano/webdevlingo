import { Fragment } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { fetchAllTerms } from '../lib/api';
import { Term } from '../lib/types';
import Layout from '../components/Layout';

interface PageProps {
  terms: {
    [key: string]: Term;
  };
}

const Home: React.FC<PageProps> = ({ terms }) => {
  return (
    <Layout showcase>
      <div className="container mx-auto px-4 pt-16">
        <ul className="divide-y divide-gray-400">
          {Object.keys(terms).map((slug) => {
            const term = terms[slug];
            return (
              <li key={slug} className="text-lg">
                <Link href={`/term/${slug}`}>
                  <a className="block px-4 py-4 hover:bg-gray-200">
                    {term.title}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const terms = await fetchAllTerms();
  return {
    props: {
      terms,
    },
    revalidate: 1,
  };
};

export default Home;
