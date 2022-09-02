import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CorporateModule } from './corporate/corporate.module';
import config from 'src/common/config/defaults';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [MongooseModule.forRoot(config.mongoURI), AuthModule, CorporateModule, CustomerModule],
  controllers: [AppController],
  providers: [
    AppService, 
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD, 
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
