import { useQuery, useMutation, queryCache } from 'react-query';
import { fetchTermBySlug, mutateTermLikes } from '../api';

function fetchTerm(key, slug) {
  return fetchTermBySlug(slug);
}

export const useTerm = (slug: string) => {
  return {
    useTermQuery: () => {
      return useQuery(['term', slug], fetchTerm, {
        enabled: slug,
      });
    },
    mutateLikes: (callback: any) => {
      return useMutation(mutateTermLikes, {
        onSuccess: () => {
          queryCache.invalidateQueries(['term', slug]);
          callback();
        },
      });
    },
  };
};
