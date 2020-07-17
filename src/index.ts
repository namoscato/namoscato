import axios from 'axios';
import * as fs from 'fs';
import * as Mustache from 'mustache';

const readmeFilename = 'README.md';
const templateExtension = '.tpl';

const stravaTypeVerbMap: any = {
  Ride: 'biking',
  Run: 'running',
};

console.log('Fetching current data');

axios.get('https://amoscato.com/data/current.json').then(response => {
  const path = `${readmeFilename}${templateExtension}`;
  console.log(`Reading ${path}`);
  const template = fs.readFileSync(path, 'utf8');

  console.log(`Rendering ${readmeFilename}`);
  fs.writeFileSync(
    readmeFilename,
    Mustache.render(template, viewFromResponse(response.data))
  );
});

function viewFromResponse(data: any) {
  const athleticActivity = data.athleticActivity;

  athleticActivity.verb = stravaTypeVerbMap[athleticActivity.type];
  athleticActivity.label = `${
    Math.floor(100 * athleticActivity.miles) / 100
  } miles`;

  return data;
}
