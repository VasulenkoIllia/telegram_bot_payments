import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import { AutomapperModule, AutomapperProfile } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

@Module({
  imports: [AutomapperModule.forRoot({ strategyInitializer: classes() })],
})
export class MappingInfrastructureModule {
  private static readonly logger = new Logger(MappingInfrastructureModule.name);

  private static readonly pathsToModelsFolder: string[] = [
    path.join(__dirname, '../../common/dto'),
  ];

  static registerProfilesAsync(): DynamicModule {
    try {
      const filesPaths: string[] = this.getAllFilesFromFolders(
        this.pathsToModelsFolder,
      );

      const automapperProfiles: Provider[] = [];

      filesPaths
        .filter((pathToFile: string) => {
          return (
            ['.js', '.ts'].includes(path.extname(pathToFile)) &&
            path.basename(pathToFile) != 'index'
          );
        })
        .forEach(async (pathToFile: string) => {
          const file = await import(pathToFile);
          Object.entries(file).forEach((item) => {
            const profile = item[1];
            if (
              profile &&
              typeof profile == 'function' &&
              profile.prototype instanceof AutomapperProfile
            ) {
              automapperProfiles.push(profile as Provider);
            }
          });
        });

      return {
        global: true,
        module: MappingInfrastructureModule,
        providers: automapperProfiles,
        exports: automapperProfiles,
      } as DynamicModule;
    } catch (error) {
      this.logger.error(`Unable to init mappings: ${error.message}`);
      process.exit(1);
    }
  }

  private static getAllFilesFromFolders(dirPaths: string[]) {
    const resultFiles: string[] = [];
    dirPaths.forEach((dirPath) => {
      resultFiles.push(...this.getAllFilesFromFolder(dirPath));
    });
    return resultFiles;
  }

  private static getAllFilesFromFolder(
    dirPath: string,
    arrayOfFiles: string[] = [],
  ) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
      if (fs.statSync(dirPath + '/' + file).isDirectory()) {
        arrayOfFiles = this.getAllFilesFromFolder(
          dirPath + '/' + file,
          arrayOfFiles,
        );
      } else {
        arrayOfFiles.push(path.join(dirPath, '/', file));
      }
    });

    return arrayOfFiles;
  }
}
