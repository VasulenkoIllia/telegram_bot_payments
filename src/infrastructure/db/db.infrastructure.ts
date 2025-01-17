import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DbInfrastructure implements OnModuleInit {
  private readonly logger = new Logger(DbInfrastructure.name);

  async onModuleInit() {
    await this.initialize();
  }

  async initialize(): Promise<void> {
    await this.checkDbConnection();
    await this.initRoles();
    await this.initDefaultAdminAccpunt();
  }

  private async checkDbConnection(): Promise<void> {
    try {
      //TODO
    } catch (error) {
      this.logger.error(`Unable to connect to the database: ${error.message}`);
      process.exit(1);
    }
  }

  private async initRoles(): Promise<void> {
    //TODO
  }

  private async initDefaultAdminAccpunt(): Promise<void> {
    //TODO
  }
}
