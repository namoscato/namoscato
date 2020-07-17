import axios from 'axios';
import * as fs from 'fs';
import * as Mustache from 'mustache';

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
  const {data} = await axios.get('https://amoscato.com/data/current.json');

  console.log(`Reading ${templatePath}`);
  const template = fs.readFileSync(templatePath, 'utf8');

  console.log('Rendering README');
  return Mustache.render(template, viewFromResponse(data));
}

function viewFromResponse(data: CurrentData) {
  const athleticActivity = data.athleticActivity;

  athleticActivity.verb = stravaTypeVerbMap[athleticActivity.type];
  athleticActivity.label = `${
    Math.floor(100 * athleticActivity.miles) / 100
  } miles`;

  return data;
}
