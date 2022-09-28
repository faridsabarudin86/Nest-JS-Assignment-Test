import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserRoles } from 'src/common/config/userRoles';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CorporateService } from 'src/corporate/corporate.service';
import { AddCorporateDto } from 'src/corporate/dtos/addCorporate.dto';
import { AddCorporateAdminDto } from 'src/corporate/dtos/addCorporateAdmin.dto';

@Controller('superuser')
export class SuperuserController {
  constructor(private corporateService: CorporateService) {}

  @Roles(UserRoles.superAdmin)
  @UseGuards(JwtAuthGuard)
  @Post('addcorporateadmin')
  async addCorporateAdmin(
    @Body() body: AddCorporateAdminDto,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.addCorporateAdmin(body, request.user);
  }

  @Roles(UserRoles.superAdmin)
  @UseGuards(JwtAuthGuard)
  @Post('addcorporate')
  async addCorporate(
    @Body() body: AddCorporateDto,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.addCorporate(body, request.user);
  }
}
