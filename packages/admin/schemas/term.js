const term = {
  title: 'Term',
  name: 'term',
  type: 'document',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    },
    {
      title: 'Definition',
      name: 'definition',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    },
  ],
};

export default term;
