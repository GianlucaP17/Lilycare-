import * as migration_20261031_104640_initial from './20261031_104640_initial';

export const migrations = [
  {
    up: migration_20261031_104640_initial.up,
    down: migration_20261031_104640_initial.down,
    name: '20261031_104640_initial'
  },
];
