import * as migration_20261024_110920_initial from './20261024_110920_initial';
import * as migration_20261024_122436_hero_photos from './20261024_122436_hero_photos';
import * as migration_20261024_131213_add_object_key from './20261024_131213_add_object_key';
import * as migration_20261024_132043_hero_controls from './20261024_132043_hero_controls';

export const migrations = [
  {
    up: migration_20261024_110920_initial.up,
    down: migration_20261024_110920_initial.down,
    name: '20261024_110920_initial',
  },
  {
    up: migration_20261024_122436_hero_photos.up,
    down: migration_20261024_122436_hero_photos.down,
    name: '20261024_122436_hero_photos',
  },
  {
    up: migration_20261024_131213_add_object_key.up,
    down: migration_20261024_131213_add_object_key.down,
    name: '20261024_131213_add_object_key',
  },
  {
    up: migration_20261024_132043_hero_controls.up,
    down: migration_20261024_132043_hero_controls.down,
    name: '20261024_132043_hero_controls'
  },
];
