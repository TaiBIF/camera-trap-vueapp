import idx from 'idx';

import router from '@/router';

export default new Proxy(
  {},
  {
    get(_, name) {
      return idx(router, _ => _.currentRoute.params[name]);
    },
    set() {
      throw `don't set`;
    },
  },
);
