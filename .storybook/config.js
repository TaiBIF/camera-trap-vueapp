import { configure } from '@storybook/vue';
import 'bootstrap';
import '../src/sass/app.sass';

const req = require.context('../src/components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
