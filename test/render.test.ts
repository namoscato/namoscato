import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {render} from '../src/render';
import {readmeTemplate} from '../src';

const mock = new MockAdapter(axios);

mock.onGet('https://amoscato.com/data/current.json').reply(200, {
  athleticActivity: {
    miles: 3.4175405,
    type: 'Run',
    url: 'https://www.strava.com/activities/3770171237',
  },
  book: {
    title: 'Domain-Driven Design Quickly',
    url:
      'https://www.goodreads.com/book/show/2558105.Domain_Driven_Design_Quickly',
  },
  drink: {
    name: 'Over the Moon',
    url: 'https://untappd.com/user/namoscato/checkin/911389754',
  },
  music: {
    artist: 'Yellowjackets',
    url: 'https://www.last.fm/music/Yellowjackets/_/Can%27t+We+Elope',
  },
  video: {
    title: 'Thank you, teachers. Thank you times infinity.',
    url: 'https://youtu.be/GqmLCMiUrdo',
  },
});

mock.onGet('https://amoscato.com/journal/index.xml').reply(
  200,
  `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<script/>
<channel>
<item>
<title>Observable Development</title>
<link>https://amoscato.com/journal/observable-development/</link>
</item>
</channel>
</rss>`
);

const expectedContent = `
* ✏️ writing [“Observable Development”](https://amoscato.com/journal/observable-development/)
* 🎧 listening to [Yellowjackets](https://www.last.fm/music/Yellowjackets/_/Can%27t+We+Elope)
* 🏃‍♂️ running [3.41 miles](https://www.strava.com/activities/3770171237)
* 📘 reading [“Domain-Driven Design Quickly”](https://www.goodreads.com/book/show/2558105.Domain_Driven_Design_Quickly)
* 🍿 watching [“Thank you, teachers. Thank you times infinity.”](https://youtu.be/GqmLCMiUrdo)
* 🍺 drinking [Over the Moon](https://untappd.com/user/namoscato/checkin/911389754)
`;

test('render', () => {
  return render(readmeTemplate).then(content => {
    expect(content).toContain(expectedContent);
  });
});
