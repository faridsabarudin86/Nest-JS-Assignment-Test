import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AuthSchema } from 'src/auth/schemas/auth.schema';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerVehicleSchema } from './schemas/customer-vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'User', schema: AuthSchema}]),
    MongooseModule.forFeature([{name: 'CustomerVehicle', schema: CustomerVehicleSchema}]),
    AuthModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
