import { Body, Controller, Post, UseGuards, Request, Put, Get, Delete } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRoles } from 'src/common/config/userRoles';
import { CorporateService } from './corporate.service';
import { AddEmployeeDto } from './dtos/addEmployee.dto';
import { GetAllEmployeeDto } from './dtos/getAllEmployees.dto';
import { AddCorporateAdminDto } from './dtos/addCorporateAdmin.dto';
import { AddCorporateDto } from './dtos/addCorporate.dto';
import { AddBranchDto } from './dtos/addBranch.dto';
import { GetEmployeeDto } from './dtos/getEmployee.dto';
import { UpdateEmployeeDto } from './dtos/updateEmployee.dto';
import { UpdateSelfAccountDto } from './dtos/updateSelfAccount.dto';
import { UpdateCorporateDto } from './dtos/updateCorporate.dto';
import { DeleteEmployeeDto } from './dtos/deleteEmployee.dto';
import { UpdateCorporateBranchDto } from './dtos/updateCorporateBranch.dto';

@Controller('corporate')
export class CorporateController {
    constructor(private corporateService: CorporateService) {}

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Get('getallemployees')
    async getAllEmployees(@Body() getAllEmployeeDto: GetAllEmployeeDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.getAllEmployees(getAllEmployeeDto, request.user);
    }

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Get('getemployee')
    async getEmployee(@Body() getEmployeeDto: GetEmployeeDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.getEmployee(getEmployeeDto, request.user);
    }
    
    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Post('addemployee')
    async addEmployee(@Body() addEmployeeDto: AddEmployeeDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.addEmployee(addEmployeeDto, request.user);
    }

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Put('updateemployee')
    async updateEmployee(@Body() updateEmployeeDto: UpdateEmployeeDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.updateEmployee(updateEmployeeDto, request.user);
    }

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Put('updateselfaccount')
    async updateSelfAccount(@Body() updateSelfAccountDto: UpdateSelfAccountDto, @Request() request: any): Promise <any>
    {
        return this.corporateService.updateSelfAccount(updateSelfAccountDto, request.user);
    }

    // @Roles(UserRoles.superAdmin, UserRoles.corporate)
    // @UseGuards(JwtAuthGuard)
    // @Delete('deleteemployee')
    // async deleteEmployee(@Body() deleteEmployeeDto: DeleteEmployeeDto, @Request() request: any): Promise<any>
    // {
    //     return this.corporateService.deleteEmployee(deleteEmployeeDto, request.user);
    // }

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

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Put('updatecorporate')
    async updateCorporate(@Body() updateCorporateDto: UpdateCorporateDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.updateCorporate(updateCorporateDto, request.user)
    }

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Put('updatecorporatebranch')
    async updateCorporateBranch(@Body() updateCorporateBranchDto: UpdateCorporateBranchDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.updateCorporateBranch(updateCorporateBranchDto, request.user)
    }

    @Roles(UserRoles.superAdmin, UserRoles.corporate)
    @UseGuards(JwtAuthGuard)
    @Post('addbranch')
    async addBranch(@Body() addBranchDto: AddBranchDto, @Request() request: any): Promise<any>
    {
        return this.corporateService.addBranch(addBranchDto, request.user);
    }
}
