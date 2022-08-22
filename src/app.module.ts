import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { CorporateModule } from './corporate/corporate.module';
import { BookingController } from './booking/booking.controller';
import { BookingModule } from './booking/booking.module';
import config from 'src/config/defaults';

@Module({
  imports: [MongooseModule.forRoot(config.mongoURI), AuthModule, CustomerModule, CorporateModule, BookingModule],
  controllers: [AppController, BookingController],
  providers: [AppService],
})
export class AppModule {}
