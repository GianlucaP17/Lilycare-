import * as migration_20261031_173042_initial from './20261031_173042_initial';
import * as migration_20261102_140433_legal_data from './20261102_140433_legal_data';

export const migrations = [
  {
    up: migration_20261031_173042_initial.up,
    down: migration_20261031_173042_initial.down,
    name: '20261031_173042_initial',
  },
  {
    up: migration_20261102_140433_legal_data.up,
    down: migration_20261102_140433_legal_data.down,
    name: '20261102_140433_legal_data'
  },
];
