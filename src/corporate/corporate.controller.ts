import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Put,
  Get,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRoles } from 'src/common/config/userRoles';
import { CorporateService } from './corporate.service';
import { AddEmployeeDto } from './dtos/addEmployee.dto';
import { GetAllEmployeeDto } from './dtos/getAllEmployees.dto';
import { AddCorporateAdminDto } from './dtos/addCorporateAdmin.dto';
import { AddCorporateDto } from './dtos/addCorporate.dto';
import { AddBranchDto } from './dtos/addBranch.dto';
import { UpdateEmployeeInfoDto } from './dtos/updateEmployeeInfo.dto';
import { UpdateSelfAccountDto } from './dtos/updateSelfAccount.dto';
import { UpdateCorporateDto } from './dtos/updateCorporate.dto';
import { DeleteEmployeeDto } from './dtos/deleteEmployee.dto';
import { UpdateCorporateBranchDto } from './dtos/updateCorporateBranch.dto';
import { AuthService } from 'src/auth/auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { SignInDto } from 'src/auth/dtos/sign-in.dto';

@Controller('corporate')
export class CorporateController {
  constructor(
    private corporateService: CorporateService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('signin')
  async signInCorporate(@Body() body: SignInDto): Promise<any> {
    return this.authService.signInCorporate(body);
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Get(':corporateId/:branchId/employee')
  async getAllEmployees(
    @Param('corporateId') paramCorporateId: string,
    @Param('branchId') paramBranchId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.getAllEmployees(
      paramCorporateId,
      paramBranchId,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Get(':corporateId/:branchId/employee/employeeinfo/:employeeId')
  async getEmployeeInfo(
    @Param('corporateId') paramCorporateId: string,
    @Param('branchId') paramBranchId: string,
    @Param('employeeId') paramEmployeeId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.getEmployeeInfo(
      paramCorporateId,
      paramBranchId,
      paramEmployeeId,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Post(':corporateId/:branchId/employee')
  async addEmployee(
    @Param('corporateId') paramCorporateId: string,
    @Param('branchId') paramBranchId: string,
    @Body() body: AddEmployeeDto,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.addEmployee(
      paramCorporateId,
      paramBranchId,
      body,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Put(':corporateId/:branchId/employee/employeeinfo/:employeeId')
  async updateEmployeeInfo(
    @Param('corporateId') paramCorporateId: string,
    @Param('branchId') paramBranchId: string,
    @Param('employeeId') paramEmployeeId: string,
    @Body() body: UpdateEmployeeInfoDto,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.updateEmployeeInfo(
      paramCorporateId,
      paramBranchId,
      paramEmployeeId,
      body,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Get('account')
  async getSelfAccount(@Request() request: any): Promise<any> {
    return this.corporateService.getSelfAccount(request.user);
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Put('account')
  async updateSelfAccount(
    @Body() body: UpdateSelfAccountDto,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.updateSelfAccount(body, request.user);
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Get(':corporateId/corporateinfo')
  async getCorporateInfo(
    @Param('corporateId') paramCorporateId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.getCorporateInfo(
      paramCorporateId,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Put(':corporateId/corporateinfo/:corporateId')
  async updateCorporate(
    @Param('corporateId') paramCorporateId: string,
    @Body() body: UpdateCorporateDto,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.updateCorporate(
      paramCorporateId,
      body,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Get(':corporateId/:branchId/branches')
  async getAllBranches(
    @Param('corporateId') paramCorporateId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.getAllBranches(paramCorporateId, request.user);
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Post(':corporateId/:branchId/branches')
  async addBranch(
    @Body() body: AddBranchDto,
    @Param('corporateId') paramCorporateId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.addBranch(
      paramCorporateId,
      body,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Get(':corporateId/:branchId/branches/branchesinfo/:branchId')
  async getCorporateBranchInfo(
    @Param('corporateId') paramCorporateId: string,
    @Param('branchId') paramBranchId: string,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.getCorporateBranchInfo(
      paramCorporateId,
      paramBranchId,
      request.user,
    );
  }

  @Roles(UserRoles.superAdmin, UserRoles.corporate)
  @UseGuards(JwtAuthGuard)
  @Put(':corporateId/:branchId/branches/branchesinfo/:branchId')
  async updateCorporateBranch(
    @Param('corporateId') paramCorporateId: string,
    @Param('branchId') paramBranchId: string,
    @Body() body: UpdateCorporateBranchDto,
    @Request() request: any,
  ): Promise<any> {
    return this.corporateService.updateCorporateBranch(
      paramCorporateId,
      paramBranchId,
      body,
      request.user,
    );
  }
}
