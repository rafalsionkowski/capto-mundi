import * as migration_20261024_110920_initial from './20261024_110920_initial';
import * as migration_20261024_122436_hero_photos from './20261024_122436_hero_photos';

export const migrations = [
  {
    up: migration_20261024_110920_initial.up,
    down: migration_20261024_110920_initial.down,
    name: '20261024_110920_initial',
  },
  {
    up: migration_20261024_122436_hero_photos.up,
    down: migration_20261024_122436_hero_photos.down,
    name: '20261024_122436_hero_photos'
  },
];
