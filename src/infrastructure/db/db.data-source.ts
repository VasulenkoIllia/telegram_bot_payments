import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import { appConfigInstance } from '../app-config/app-config.infrastructure';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: appConfigInstance.DB_HOST,
  port: appConfigInstance.DB_PORT,
  username: appConfigInstance.DB_USERNAME,
  password: appConfigInstance.DB_PASSWORD,
  database: appConfigInstance.DB_NAME,
  synchronize: appConfigInstance.DB_SYNCHRONIZE,
  cache: true,
  migrations: [path.join(__dirname, '../../', 'migrations', '*.{js,ts}')],
  entities: [path.join(__dirname, '../../', 'entities', '*.entity.{js,ts}')],
};
export const appDataSource = new DataSource(dataSourceOptions);
