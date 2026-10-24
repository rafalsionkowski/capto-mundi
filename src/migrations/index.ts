import * as migration_20261024_110920_initial from './20261024_110920_initial';

export const migrations = [
  {
    up: migration_20261024_110920_initial.up,
    down: migration_20261024_110920_initial.down,
    name: '20261024_110920_initial'
  },
];
