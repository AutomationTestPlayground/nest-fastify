import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { appConfig, DbCustomLogger } from '@config';
import { MainSeeder } from './main.seeder';
import { member1669372347132 } from './migrations/1668566358184-member';
import {
  Code,
  CodeType,
  Data,
  DataTranslation,
  DataType,
  Parameter,
  Post,
  PostTranslation,
  PostType,
  Province,
  District,
  Ward,
  Address,
  User,
  UserRole,
} from '@model';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: appConfig.DATABASE_HOST,
  port: appConfig.DATABASE_PORT,
  username: appConfig.DATABASE_USER,
  password: appConfig.DATABASE_PASSWORD,
  database: appConfig.DATABASE_NAME,
  entities: [
    Code,
    CodeType,
    Province,
    District,
    Ward,
    Address,
    User,
    UserRole,
    Data,
    DataTranslation,
    DataType,
    Parameter,
    Post,
    PostTranslation,
    PostType,
  ],
  migrations: [member1669372347132],
  seeds: [MainSeeder],
  factories: ['database/factories/**/*{.ts,.js}'],
  logging: ['error'],
  logger: appConfig.NODE_ENV !== 'prod' ? 'advanced-console' : new DbCustomLogger(),
};
export const AppDataSource = new DataSource(options);
