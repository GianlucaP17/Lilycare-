import * as migration_20261031_173042_initial from './20261031_173042_initial';
import * as migration_20261102_140433_legal_data from './20261102_140433_legal_data';
import * as migration_20261102_163316_cover_images from './20261102_163316_cover_images';
import * as migration_20261102_174302_image_style from './20261102_174302_image_style';
import * as migration_20261102_182729_job_applications from './20261102_182729_job_applications';
import * as migration_20261102_190728_cv_candidature from './20261102_190728_cv_candidature';

export const migrations = [
  {
    up: migration_20261031_173042_initial.up,
    down: migration_20261031_173042_initial.down,
    name: '20261031_173042_initial',
  },
  {
    up: migration_20261102_140433_legal_data.up,
    down: migration_20261102_140433_legal_data.down,
    name: '20261102_140433_legal_data',
  },
  {
    up: migration_20261102_163316_cover_images.up,
    down: migration_20261102_163316_cover_images.down,
    name: '20261102_163316_cover_images',
  },
  {
    up: migration_20261102_174302_image_style.up,
    down: migration_20261102_174302_image_style.down,
    name: '20261102_174302_image_style',
  },
  {
    up: migration_20261102_182729_job_applications.up,
    down: migration_20261102_182729_job_applications.down,
    name: '20261102_182729_job_applications',
  },
  {
    up: migration_20261102_190728_cv_candidature.up,
    down: migration_20261102_190728_cv_candidature.down,
    name: '20261102_190728_cv_candidature'
  },
];
