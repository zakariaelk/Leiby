import { config, collection, singleton, fields } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

const colors = fields.select({
  label: 'Accent colour',
  options: [
    { label: 'Coral', value: 'coral' },
    { label: 'Blue', value: 'blue' },
    { label: 'Mint', value: 'mint' },
    { label: 'Pink', value: 'pink' },
  ],
  defaultValue: 'coral',
});

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

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Leiby Design & Build' },
    navigation: {
      Work: ['projects', 'services'],
      Writing: ['posts'],
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
        color: colors,
        order: fields.integer({ label: 'Order', defaultValue: 99 }),
        featured: fields.checkbox({ label: 'Show on the home page', defaultValue: false }),
        content: body('projects'),
      },
    }),
    posts: collection({
      label: 'Blog posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Publish date', validation: { isRequired: true } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        tag: fields.text({ label: 'Tag', defaultValue: 'Notes' }),
        color: colors,
        content: body('posts'),
      },
    }),
    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { data: 'json' },
      columns: ['order'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        short: fields.text({ label: 'Tile label (short)' }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        deliverables: fields.array(fields.text({ label: 'Item' }), {
          label: 'What you get',
          itemLabel: (p) => p.value,
        }),
        icon: fields.select({
          label: 'Icon shape',
          options: [
            { label: 'Target', value: 'target' },
            { label: 'Browser', value: 'browser' },
            { label: 'Phone', value: 'phone' },
            { label: 'Chart', value: 'chart' },
            { label: 'Blocks', value: 'blocks' },
            { label: 'Spark', value: 'spark' },
          ],
          defaultValue: 'target',
        }),
        color: colors,
        order: fields.integer({ label: 'Order', defaultValue: 99 }),
      },
    }),
  },
  singletons: {
    home: singleton({
      label: 'Home page',
      path: 'src/content/pages/home',
      format: { data: 'json' },
      schema: {
        heroTitle: fields.text({ label: 'Hero title' }),
        heroText: fields.text({ label: 'Hero text', multiline: true }),
        heroLink: fields.text({ label: 'Hero link label' }),
        servicesTitle: fields.text({ label: 'Services title' }),
        processTitle: fields.text({ label: 'How we work title' }),
        process: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            text: fields.text({ label: 'Text', multiline: true }),
          }),
          { label: 'How we work steps', itemLabel: (p) => p.fields.title.value },
        ),
        ctaTitle: fields.text({ label: 'CTA card title' }),
        ctaText: fields.text({ label: 'CTA card text', multiline: true }),
        ctaButton: fields.text({ label: 'CTA card button' }),
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
        experience: fields.array(
          fields.object({
            name: fields.text({ label: 'Company' }),
            role: fields.text({ label: 'Role' }),
            years: fields.text({ label: 'Years' }),
          }),
          { label: 'Experience', itemLabel: (p) => p.fields.name.value },
        ),
        content: body('pages'),
      },
    }),
    settings: singleton({
      label: 'Site settings',
      path: 'src/content/pages/settings',
      format: { data: 'json' },
      schema: {
        email: fields.text({ label: 'Email' }),
        linkedin: fields.url({ label: 'LinkedIn URL' }),
        availability: fields.text({ label: 'Availability note' }),
        location: fields.text({ label: 'Location' }),
      },
    }),
  },
});
