import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/common/dtos/user.dto';
import { UserRoles } from 'src/common/config/userRoles';
import { v4 as uuid } from 'uuid';
import { AddEmployeeDto } from './dtos/addEmployee.dto';
import { GetEmployeeDto } from './dtos/getAllEmployees.dto';
import { AddCorporateDto } from './dtos/addCorporate.dto';
import { generate } from 'generate-password';
import * as bcrypt from 'bcrypt';
import { CorporateDto } from 'src/common/dtos/corporate.dto';
import { AddBranchDto } from './dtos/addBranch.dto';
import { CorporateBranchDto } from 'src/common/dtos/corporate-branch.dto';
import { AddCorporateAdminDto } from './dtos/addCorporateAdmin.dto';

@Injectable()
export class CorporateService 
{
    constructor
    (
        @InjectModel('User') private readonly userModel: Model<UserDto>,
        @InjectModel('Corporate') private readonly corporateModel: Model<CorporateDto>,
        @InjectModel('CorporateBranch') private readonly corporateBranchModel: Model<CorporateBranchDto>,
    ) {}
        
        async getAllCorporatesAndBranches(request: any): Promise<any>
        {
            const getCorporateAndBranches = await this.userModel.findOne
            ({ 
                uuid: request.userId,
                $or:
                [
                    { role: UserRoles.superAdmin },
                    { role: UserRoles.corporate },
                ],
            });

            if(!getCorporateAndBranches) throw new BadRequestException('User is not authorized');

            return getCorporateAndBranches.corporate;
        }
    
        async getAllEmployees(getEmployeeDto: GetEmployeeDto, request: any): Promise<any>
        {
            const verifyUser = await this.userModel.findOne
            ({ 
                uuid: request.userId,
                $or: 
                [
                    {
                        role: UserRoles.superAdmin
                    },
                    {
                        role: UserRoles.corporate,
                        'corporate.uuid': getEmployeeDto.corporateUuid,
                        'corporate.branch.uuid': getEmployeeDto.branchUuid,
                    },
                ],
            });

            if(!verifyUser) throw new BadRequestException('User is not authorized');

            const getEmployees = await this.userModel.find
            (
                { 
                    'corporate.uuid': getEmployeeDto.corporateUuid,
                    'corporate.branch.uuid': getEmployeeDto.branchUuid,
                }
            );

            return getEmployees;
        }

        async getEmployee()
        {

        }

        async addEmployee(addEmployeeDto: AddEmployeeDto, request: any): Promise<any>
        {
            const verifyUser = await this.userModel.findOne
            ({ 
                uuid: request.userId,
                $or: 
                [
                    {
                        role: UserRoles.superAdmin
                    },
                    {
                        role: UserRoles.corporate,
                        'corporate.uuid': addEmployeeDto.corporateUuid,
                        'corporate.role': UserRoles.corporateAdmin,
                    },
                    {
                        role: UserRoles.corporate,
                        'corporate.uuid': addEmployeeDto.corporateUuid,
                        'corporate.branch.uuid': addEmployeeDto.branchUuid,
                        'corporate.branch.role': UserRoles.branchAdmin,
                    },
                ],
            });

            if(!verifyUser) throw new BadRequestException('User is not authorized');

            const hash = await bcrypt.hash(addEmployeeDto.password, 10);

            console.log(addEmployeeDto);

            addEmployeeDto.uuid = uuid();
            addEmployeeDto.password = hash;
            addEmployeeDto.role = UserRoles.corporate;

            console.log(addEmployeeDto);
            
            addEmployeeDto.corporate[addEmployeeDto.corporate.length - 1].uuid = addEmployeeDto.corporateUuid;
            addEmployeeDto.corporate[addEmployeeDto.corporate.length - 1].role = UserRoles.employee;
            addEmployeeDto.corporate[addEmployeeDto.corporate.length - 1].branch[addEmployeeDto.corporate[addEmployeeDto.corporate.length - 1].branch.length - 1].role = UserRoles.sales;
            addEmployeeDto.corporate[addEmployeeDto.corporate.length - 1].branch[addEmployeeDto.corporate[addEmployeeDto.corporate.length - 1].branch.length - 1].uuid = addEmployeeDto.branchUuid;

            const newEmployee = new this.userModel(addEmployeeDto);
            return await newEmployee.save();
        }

        async updateEmployee()
        {

        }

        async updateSelf()
        {

        }

        async deleteEmployee()
        {

        }

        // Update the code so that the super admin only needs to enter corporate email address
        // Check if user is already existed (Corporate Admin or Regular Corporate).
        async addCorporateAdmin(addCorporateAdminDto: AddCorporateAdminDto, request: any): Promise<any>
        {
            const verifyUser = await this.userModel.findOne
            ({ 
                uuid: request.userId,
                role: UserRoles.superAdmin,
            });
            
            if(!verifyUser) throw new BadRequestException('User is not authorized');

            const hash = await bcrypt.hash(addCorporateAdminDto.password, 10);

            addCorporateAdminDto.uuid = uuid();
            addCorporateAdminDto.password = hash;
            addCorporateAdminDto.role = UserRoles.corporate;
            addCorporateAdminDto.corporate[addCorporateAdminDto.corporate.length - 1].role = UserRoles.corporateAdmin;

            const newCorporateAdmin = new this.userModel(addCorporateAdminDto);
            return await newCorporateAdmin.save();
        }

        // Add validation if the corporate has existed or not through the their email address
        async addCorporate(addCorporateDto: AddCorporateDto, request: any ): Promise<any>
        {
            const verifyUser = await this.userModel.findOne
            ({ 
                uuid: request.userId,
                role: UserRoles.superAdmin,
            });
            
            if(!verifyUser) throw new BadRequestException('User is not authorized');

            addCorporateDto.uuid = uuid();
            
            const newCorporate = new this.corporateModel(addCorporateDto);
            return await newCorporate.save();
        }

        async updateCorporate()
        {

        }

        async addBranch(addBranchDto: AddBranchDto, request: any): Promise<any>
        {
            const verifyUser = await this.userModel.findOne
            ({ 
                uuid: request.userId,
                $or: 
                [
                    {
                        role: UserRoles.corporate,
                        'corporate.uuid': addBranchDto.corporateUuid,
                        'corporate.role': UserRoles.corporateAdmin,
                    },
                    {
                        role: UserRoles.corporate,
                        'corporate.uuid': addBranchDto.corporateUuid,
                        'corporate.branch.uuid': addBranchDto.branchUuid,
                        'corporate.branch.role': UserRoles.branchAdmin,
                    },
                    {
                        role: UserRoles.superAdmin
                    },
                ],
            });
            
            if(!verifyUser) throw new BadRequestException('User is not authorized');

            addBranchDto.uuid = uuid();
            
            const newCorporateBranch = new this.corporateBranchModel(addBranchDto);
            return await newCorporateBranch.save();
        }

        async updateBranch()
        {

        }
}
