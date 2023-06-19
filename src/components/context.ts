'use strict';

import * as cls from 'cls-hooked';

const namespace = cls.createNamespace('context');

export function run(name, data, fn) {
  namespace.run(() => {
    namespace.set('name', name);
    namespace.set('data', data);

    fn();
  });
}

export function current() {
  return namespace.active === null
    ? null
    : {
        name: namespace.get('name'),
        data: namespace.get('data'),
        bindEmitter: namespace.bindEmitter.bind(namespace),
      };
}
