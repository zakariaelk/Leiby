import { config, collection, singleton, fields } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

const video = block({
  label: 'Video',
  schema: {
    src: fields.text({ label: 'Video path', description: 'e.g. /media/projects/my-project/clip.mp4 (files live in public/media)' }),
    alt: fields.text({ label: 'Caption / description' }),
  },
});

const body = (dir: string) =>
  fields.markdoc({
    label: 'Content',
    options: {
      image: { directory: `src/assets/${dir}`, publicPath: `../../assets/${dir}/` },
    },
    components: { video },
  });

const timeline = (label: string) =>
  fields.array(
    fields.object({
      name: fields.text({ label: 'Name' }),
      role: fields.text({ label: 'Description' }),
      years: fields.text({ label: 'Years' }),
    }),
    { label, itemLabel: (p) => p.fields.name.value },
  );

export default config({
  // Edits are saved as commits to GitHub; Netlify rebuilds the site on every commit.
  storage: { kind: 'github', repo: 'zakariaelk/Leiby' },
  ui: {
    brand: { name: 'Zakaria El Khachia' },
    navigation: {
      Work: ['projects'],
      Pages: ['home', 'about', 'settings'],
    },
  },
  collections: {
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['client', 'year'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        client: fields.text({ label: 'Client (short name for cards)' }),
        headline: fields.text({ label: 'Headline (case study page)' }),
        summary: fields.text({ label: 'Card summary', multiline: true }),
        intro: fields.text({ label: 'Intro (case study page)', multiline: true }),
        sector: fields.text({ label: 'Sector' }),
        role: fields.text({ label: 'Role' }),
        duration: fields.text({ label: 'Duration' }),
        year: fields.text({ label: 'Year' }),
        link: fields.url({ label: 'Live link' }),
        cover: fields.image({ label: 'Cover image', directory: 'src/assets/projects', publicPath: '../../assets/projects/' }),
        order: fields.integer({ label: 'Order', defaultValue: 99 }),
        featured: fields.checkbox({ label: 'Featured (large card at the top)', defaultValue: false }),
        tier: fields.select({
          label: 'Type',
          options: [
            { label: 'Case study', value: 'case' },
            { label: 'Earlier work (short entry)', value: 'earlier' },
          ],
          defaultValue: 'case',
        }),
        problem: fields.text({ label: 'In short: the problem (why)', multiline: true }),
        did: fields.text({ label: 'In short: what I did', multiline: true }),
        result: fields.text({ label: 'In short: the result', multiline: true }),
        hard: fields.text({ label: 'In short: what was hard / what I would do differently', multiline: true }),
        content: body('projects'),
      },
    }),
  },
  singletons: {
    home: singleton({
      label: 'Home page',
      path: 'src/content/pages/home',
      format: { data: 'json' },
      schema: {
        heroText: fields.text({
          label: 'Intro',
          multiline: true,
          description: 'Wrap words in *single stars* to highlight them, and **double stars** to make them bold.',
        }),
        shortIntro: fields.text({ label: 'Short intro (simple version)', multiline: true }),
        cities: fields.array(fields.text({ label: 'City' }), { label: 'Cities', itemLabel: (p) => p.value }),
        workTitle: fields.text({ label: 'Work section title' }),
      },
    }),
    about: singleton({
      label: 'About page',
      path: 'src/content/pages/about/',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.text({ label: 'Title' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        experience: timeline('Experience'),
        education: timeline('Education'),
        languages: fields.array(fields.text({ label: 'Language' }), { label: 'Languages', itemLabel: (p) => p.value }),
        content: body('pages'),
      },
    }),
    settings: singleton({
      label: 'Site settings',
      path: 'src/content/pages/settings',
      format: { data: 'json' },
      schema: {
        name: fields.text({ label: 'Name' }),
        role: fields.text({ label: 'Role' }),
        email: fields.text({ label: 'Email' }),
        linkedin: fields.url({ label: 'LinkedIn URL' }),
        availability: fields.text({ label: 'Availability note' }),
        contactTitle: fields.text({ label: 'Contact section title' }),
        contactText: fields.text({ label: 'Contact section text', multiline: true }),
      },
    }),
  },
});
