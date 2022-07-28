import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { DealershipModule } from './dealership/dealership.module';
import config from 'src/config/defaults';

@Module({
  imports: [MongooseModule.forRoot(config.mongoURI), AuthModule, CustomerModule, DealershipModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
