import axios from 'axios';
import * as fs from 'fs';
import * as Mustache from 'mustache';
import * as RssParser from 'rss-parser';

const rssParser = new RssParser();

const stravaTypeVerbMap: Record<string, string> = {
  Ride: 'biking',
  Run: 'running',
};

interface CurrentData {
  athleticActivity: {
    type: string;
    miles: number;
    verb?: string;
    label?: string;
  };
}

export async function render(templatePath: string) {
  console.log('Fetching current data');
  const {data} = await get('data/current.json');

  console.log('Fetching latest journal');
  data.journal = await fetchJournal();

  console.log(`Reading ${templatePath}`);
  const template = fs.readFileSync(templatePath, 'utf8');

  console.log('Rendering README');
  return Mustache.render(template, viewFromResponse(data));
}

async function fetchJournal() {
  const {data} = await get('journal/index.xml');
  const journalFeed = await rssParser.parseString(data);
  const journal = journalFeed.items![0];

  return {
    title: journal.title,
    url: journal.link,
  };
}

async function get(path: string) {
  return axios.get(`https://amoscato.com/${path}`);
}

function viewFromResponse(data: CurrentData) {
  const athleticActivity = data.athleticActivity;

  athleticActivity.verb = stravaTypeVerbMap[athleticActivity.type];
  athleticActivity.label = `${
    Math.floor(100 * athleticActivity.miles) / 100
  } miles`;

  return data;
}
