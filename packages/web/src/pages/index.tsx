import { Fragment } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import PortableText from '@sanity/block-content-to-react';
import { fetchAllTerms } from '../lib/api';
import { Term } from '../lib/types';
import Layout from '../components/Layout';
import styles from '../styles/blocks.module.css';

interface PageProps {
  terms: Term[];
}

const Home: React.FC<PageProps> = ({ terms }) => {
  console.log(terms);
  return (
    <Layout showcase>
      <div className="container mx-auto px-4 pt-16">
        <ul className="divide-y divide-gray-400">
          {terms.map((term) => (
            <li className="text-lg">
              <Link href={`/term/${term.slug.current}`}>
                <a className="block px-4 py-4 hover:bg-gray-200">
                  {term.title}
                </a>
              </Link>
            </li>
          ))}
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
