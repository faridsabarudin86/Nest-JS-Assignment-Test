import { Body, Controller, Post, UseGuards, Request, Put, Get } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRoles } from 'src/common/config/userRoles';
import { CorporateService } from './corporate.service';
import { AddEmployeeDto } from './dtos/addEmployee.dto';
import { GetEmployeeDto } from './dtos/getAllEmployees.dto';
import { AddCorporateAdminDto } from './dtos/addCorporateAdmin.dto';
import { AddCorporateDto } from './dtos/addCorporate.dto';
import { AddBranchDto } from './dtos/addBranch.dto';

@Controller('corporate')
export class CorporateController {
    constructor(private corporateService: CorporateService,) {}

    @Roles(UserRoles.superAdmin || UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Get('getallemployees')
    async getAllEmployees(@Body() getEmployeeDto: GetEmployeeDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.getAllEmployees(getEmployeeDto, request.user);
    }
    
    @Roles(UserRoles.superAdmin || UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Post('addemployee')
    async addEmployee(@Body() addEmployeeDto: AddEmployeeDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.addEmployee(addEmployeeDto, request.user);
    }

    @Roles(UserRoles.superAdmin)
    @UseGuards(JwtAuthGuard)
    @Post('addcorporateadmin')
    async addCorporateAdmin(@Body() addCorporateAdminDto: AddCorporateAdminDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.addCorporateAdmin(addCorporateAdminDto, request.user);
    }

    @Roles(UserRoles.superAdmin)
    @UseGuards(JwtAuthGuard)
    @Post('addcorporate')
    async addCorporate(@Body() addCorporateDto: AddCorporateDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.addCorporate(addCorporateDto, request.user);
    }

    @Roles(UserRoles.superAdmin || UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Post('addbranch')
    async addBranch(@Body() addBranchDto: AddBranchDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.addBranch(addBranchDto, request.user);
    }
}
