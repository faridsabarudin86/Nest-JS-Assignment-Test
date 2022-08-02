import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { AuthSchema } from 'src/auth/schemas/auth.schema';
import { CustomerVehicleSchema } from 'src/customer/schemas/customer-vehicle.schema';
import { CorporateController } from './corporate.controller';
import { CorporateService } from './corporate.service';
import { CorporateBranchesSchema } from './schema/corporate-branches.schema';
import { CorporateSchema } from './schema/corporate.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'Corporate', schema: CorporateSchema}]),
        MongooseModule.forFeature([{name: 'CorporateBranches', schema: CorporateBranchesSchema}]),
        MongooseModule.forFeature([{name: 'User', schema: AuthSchema}]),
        MongooseModule.forFeature([{name: 'CustomerVehicle', schema: CustomerVehicleSchema}]),
        AuthModule,
      ],
      controllers: [CorporateController],
      providers: [CorporateService],
      exports: [CorporateService],
})
export class CorporateModule {}
