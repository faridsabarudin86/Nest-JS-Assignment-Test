import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CorporateBranchSchema } from 'src/common/schemas/corporate-branch.schema';
import { CorporateSchema } from 'src/common/schemas/corporate.schema';
import { UserSchema } from 'src/common/schemas/user.schema';
import { VehicleSchema } from 'src/common/schemas/vehicle.schema';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: 
  [
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    MongooseModule.forFeature([{name: 'Corporate', schema: CorporateSchema}]),
    MongooseModule.forFeature([{name: 'CorporateBranch', schema: CorporateBranchSchema}]),
    MongooseModule.forFeature([{name: 'Vehicle', schema: VehicleSchema}]),
    AuthModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
