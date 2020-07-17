import * as fs from 'fs';
import {render} from './render';

const readmeFilename = 'README.md';
export const readmeTemplate = `${readmeFilename}.tpl`;

render(readmeTemplate).then(contents => {
  fs.writeFileSync(readmeFilename, contents);
});
