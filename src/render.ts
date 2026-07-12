import axios from 'axios';
import {promises} from 'fs';
import * as Mustache from 'mustache';
import RssParser from 'rss-parser';

const rssParser = new RssParser();

export async function render(templatePath: string): Promise<string> {
  console.log('Fetching current data');
  const {data} = await axios.get(
    'https://storage.amoscato.com/www/data/current.json',
  );

  console.log('Fetching latest journal');
  data.journal = await fetchJournal();

  console.log(`Reading ${templatePath}`);
  const template = await promises.readFile(templatePath, 'utf8');

  console.log('Rendering README');
  return Mustache.render(template, data);
}

async function fetchJournal(): Promise<{
  title?: string;
  url?: string;
}> {
  const {data} = await axios.get('https://amoscato.com/journal/index.xml');
  const journalFeed = await rssParser.parseString(data);
  const journal = journalFeed.items[0];

  return {
    title: journal.title,
    url: journal.link,
  };
}
