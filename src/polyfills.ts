import * as nodeCrypto from 'crypto';

const cryptoPolyfill = {
  randomUUID: () => {
    if (nodeCrypto.randomUUID) {
      return nodeCrypto.randomUUID();
    }
    return nodeCrypto.randomBytes(16).toString('hex').replace(
      /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
      '$1-$2-$3-$4-$5'
    );
  },
};

(globalThis as any).crypto = cryptoPolyfill;
(global as any).crypto = cryptoPolyfill;

export {};
