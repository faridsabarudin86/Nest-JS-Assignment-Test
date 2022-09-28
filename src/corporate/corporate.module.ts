import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CorporateBranchSchema } from 'src/common/schemas/corporate-branch.schema';
import { CorporateSchema } from 'src/common/schemas/corporate.schema';
import { UserSchema } from 'src/common/schemas/user.schema';
import { CorporateController } from './corporate.controller';
import { CorporateService } from './corporate.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Corporate', schema: CorporateSchema }]),
    MongooseModule.forFeature([
      { name: 'CorporateBranch', schema: CorporateBranchSchema },
    ]),
    AuthModule,
  ],
  controllers: [CorporateController],
  providers: [CorporateService],
  exports: [CorporateService],
})
export class CorporateModule {}
