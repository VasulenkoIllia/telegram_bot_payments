import path from 'path';
import fs from 'fs';
import { Injectable } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common/interfaces';
import { HttpAdapterHost } from '@nestjs/core';
import { appConfigInstance } from '../app-config/app-config.infrastructure';

@Injectable()
export class SwaggerInfrastucture {
  private readonly swaggerUrl: string = '/swagger';
  private readonly swaggerFileName: string = 'swagger.json';
  private readonly pathToComponents: string = path.join(
    __dirname,
    '../../components',
  );
  private readonly swaggerTitle: string = appConfigInstance.PROJECT_NAME;
  private readonly swaggerDescription: string = '';

  public initialize(app: INestApplication) {
    const httpAdapterHost: HttpAdapterHost = app.get(HttpAdapterHost);
    const httpAdapter = httpAdapterHost.httpAdapter;

    const swaggerDocs: SwaggerDocInfo[] = [];
    const versionedFolderPath: string = path.join(this.pathToComponents);
    const swaggerDocInfo: SwaggerDocInfo = {
      doc: this.getSwaggerSpecDocument(app, versionedFolderPath),
      name: 'api',
      url: `/${this.swaggerFileName}`,
    };

    httpAdapter.get(swaggerDocInfo.url, (req, res) => {
      res.json(swaggerDocInfo.doc);
    });
    swaggerDocs.push(swaggerDocInfo);

    SwaggerModule.setup(this.swaggerUrl, app, undefined, {
      explorer: true,
      swaggerOptions: {
        urls: swaggerDocs.map((swaggerDocInfo: SwaggerDocInfo) => {
          return {
            url: swaggerDocInfo.url,
            name: swaggerDocInfo.name,
          };
        }),
      },
    });
  }

  private getSwaggerSpecDocument(
    app: INestApplication,
    pathToVersionedFolder: string,
  ): OpenAPIObject {
    const options = new DocumentBuilder()
      .setTitle(this.swaggerTitle)
      .setDescription(this.swaggerDescription)
      .addBearerAuth()
      .build();

    return SwaggerModule.createDocument(app, options, {
      include: this.getAllControllerModules(pathToVersionedFolder),
    });
  }

  private getAllControllerModules(
    pathToVersionedFolder: string,
  ): (() => void)[] {
    const filesPathes: string[] = this.getAllFiles(pathToVersionedFolder);
    const modules: (() => void)[] = [];
    filesPathes
      .filter((pathToFile: string) => {
        return (
          ['.js', '.ts'].includes(path.extname(pathToFile)) &&
          path.basename(pathToFile) != 'index' &&
          /.module$/.test(path.parse(pathToFile).name)
        );
      })
      .forEach(async (pathToFile: string) => {
        const file = await import(pathToFile);
        Object.entries(file).forEach((item) => {
          const value = item[1];
          if (
            value &&
            typeof value == 'function' &&
            /Module$/.test(value.name)
          ) {
            modules.push(value as () => void);
          }
        });
      });
    return modules;
  }

  private getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach((file) => {
      const pathToFile: string = path.join(dirPath, '/', file);
      if (fs.statSync(pathToFile).isDirectory()) {
        arrayOfFiles = this.getAllFiles(pathToFile, arrayOfFiles);
      } else {
        arrayOfFiles.push(pathToFile);
      }
    });

    return arrayOfFiles;
  }
}

class SwaggerDocInfo {
  public doc: OpenAPIObject;
  public name: string;
  public url: string;
}
