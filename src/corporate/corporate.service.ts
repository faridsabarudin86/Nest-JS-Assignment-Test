import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/common/dtos/user.dto';
import { UserRoles } from 'src/common/config/userRoles';
import { v4 as uuid } from 'uuid';
import { AddEmployeeDto } from './dtos/addEmployee.dto';
import { GetAllEmployeeDto } from './dtos/getAllEmployees.dto';
import { AddCorporateDto } from './dtos/addCorporate.dto';
import { generate } from 'generate-password';
import * as bcrypt from 'bcrypt';
import { CorporateDto } from 'src/common/dtos/corporate.dto';
import { AddBranchDto } from './dtos/addBranch.dto';
import { CorporateBranchDto } from 'src/common/dtos/corporate-branch.dto';
import { AddCorporateAdminDto } from './dtos/addCorporateAdmin.dto';
import { GetEmployeeDto } from './dtos/getEmployee.dto';
import { UpdateEmployeeDto } from './dtos/updateEmployee.dto';
import { UpdateSelfAccountDto } from './dtos/updateSelfAccount.dto';
import { UpdateCorporateDto } from './dtos/updateCorporate.dto';
import { DeleteEmployeeDto } from './dtos/deleteEmployee.dto';
import { UpdateCorporateBranchDto } from './dtos/updateCorporateBranch.dto';

@Injectable()
export class CorporateService {
    constructor
        (
            @InjectModel('User') private readonly userModel: Model<UserDto>,
            @InjectModel('Corporate') private readonly corporateModel: Model<CorporateDto>,
            @InjectModel('CorporateBranch') private readonly corporateBranchModel: Model<CorporateBranchDto>,
        ) { }

    // async getAllCorporatesAndBranches(request: any): Promise<any>
    // {
    //     const getCorporateAndBranches = await this.userModel.findOne
    //     ({ 
    //         uuid: request.userId,
    //         $or:
    //         [
    //             { role: UserRoles.superAdmin },
    //             { role: UserRoles.corporate },
    //         ],
    //     });

    //     if(!getCorporateAndBranches) throw new BadRequestException('User is not authorized');

    //     return getCorporateAndBranches.corporate;
    // }

    async getAllEmployees(getAllEmployeeDto: GetAllEmployeeDto, request: any): Promise<any> {
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
                            'corporate.uuid': getAllEmployeeDto.corporateUuid,
                            'corporate.branch.uuid': getAllEmployeeDto.branchUuid,
                        },
                    ],
            });

        if (!verifyUser) throw new BadRequestException('User is not authorized');

        const getEmployees = await this.userModel.find
            (
                {
                    'corporate.uuid': getAllEmployeeDto.corporateUuid,
                    'corporate.branch.uuid': getAllEmployeeDto.branchUuid,
                }
            );

        return getEmployees;
    }

    async getEmployee(getEmployeeDto: GetEmployeeDto, request: any): Promise<any> {
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

        if (!verifyUser) throw new BadRequestException('User is not authorized');

        const getEmployees = await this.userModel.find
            (
                {
                    uuid: getEmployeeDto.uuid,
                    'corporate.uuid': getEmployeeDto.corporateUuid,
                    'corporate.branch.uuid': getEmployeeDto.branchUuid,
                }
            );

        return getEmployees;
    }

    async addEmployee(addEmployeeDto: AddEmployeeDto, request: any): Promise<any> {
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

        if (!verifyUser) throw new BadRequestException('User is not authorized');

        const hash = await bcrypt.hash(addEmployeeDto.password, 10);

        addEmployeeDto.uuid = uuid();
        addEmployeeDto.password = hash;
        addEmployeeDto.role = UserRoles.corporate;

        for (let i = 0; i < addEmployeeDto.corporate.length; i++) {
            addEmployeeDto.corporate[i].uuid = addEmployeeDto.corporateUuid;
            addEmployeeDto.corporate[i].role = UserRoles.employee;
            addEmployeeDto.corporate[i].branch[i].role = UserRoles.sales;
            addEmployeeDto.corporate[i].branch[i].uuid = addEmployeeDto.branchUuid;
        }

        const newEmployee = new this.userModel(addEmployeeDto);
        return await newEmployee.save();
    }

    async updateEmployee(updateEmployeeDto: UpdateEmployeeDto, request: any): Promise<any> {
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
                            'corporate.uuid': updateEmployeeDto.corporateUuid,
                            'corporate.role': UserRoles.corporateAdmin,
                        },
                        {
                            role: UserRoles.corporate,
                            'corporate.uuid': updateEmployeeDto.corporateUuid,
                            'corporate.branch.uuid': updateEmployeeDto.branchUuid,
                            'corporate.branch.role': UserRoles.branchAdmin,
                        },
                    ],
            });

        if (!verifyUser) throw new BadRequestException('User is not authorized');

        if (updateEmployeeDto.password !== null || '') {
            const hash = await bcrypt.hash(updateEmployeeDto.password, 10);
            updateEmployeeDto.password = hash;
        }

        const updatedInformation =
        {
            emailAddress: updateEmployeeDto.emailAddress,
            password: updateEmployeeDto.password,
            fullName: updateEmployeeDto.fullName,
            phoneNumber: updateEmployeeDto.phoneNumber,
        }

        Object.keys(updatedInformation).forEach
            (key => {

                if (updatedInformation[key] === null || updatedInformation[key] === '') {
                    delete updatedInformation[key];
                }
            });

        const updateUser = await this.userModel.findOneAndUpdate
            (
                { uuid: updateEmployeeDto.uuid, 'corporate.uuid': updateEmployeeDto.corporateUuid, 'corporate.branch.uuid': updateEmployeeDto.branchUuid },
                updatedInformation,
                { new: true }
            );

        return await updateUser.save();
    }

    async updateSelfAccount(updateSelfAccountDto: UpdateSelfAccountDto, request: any): Promise<any> {
        const verifyUser = await this.userModel.findOne
            ({
                uuid: request.userId,
            });

        if (!verifyUser) throw new BadRequestException('User is not authorized');

        if (updateSelfAccountDto.password !== null || '') {
            const hash = await bcrypt.hash(updateSelfAccountDto.password, 10);
            updateSelfAccountDto.password = hash;
        }

        const updatedInformation =
        {
            emailAddress: updateSelfAccountDto.emailAddress,
            password: updateSelfAccountDto.password,
            fullName: updateSelfAccountDto.fullName,
            phoneNumber: updateSelfAccountDto.phoneNumber,
        }

        Object.keys(updatedInformation).forEach
            (key => {

                if (updatedInformation[key] === null || updatedInformation[key] === '') {
                    delete updatedInformation[key];
                }
            });

        const updateUser = await this.userModel.findOneAndUpdate
            (
                { uuid: request.userId },
                updatedInformation,
                { new: true }
            );

        return await updateUser.save();
    }

    // Needs validation such as Cannot delete Super User or Corporate Admin
    // async deleteEmployee(deleteEmployeeDto: DeleteEmployeeDto, request: any): Promise<any>
    // {
    //     const verifyUser = await this.userModel.findOne
    //     ({ 
    //         uuid: request.userId,
    //         $or: 
    //         [
    //             {
    //                 role: UserRoles.superAdmin
    //             },
    //             {
    //                 role: UserRoles.corporate,
    //                 'corporate.uuid': deleteEmployeeDto.corporateUuid,
    //                 'corporate.role': UserRoles.corporateAdmin,
    //             },
    //             {
    //                 role: UserRoles.corporate,
    //                 'corporate.uuid': deleteEmployeeDto.corporateUuid,
    //                 'corporate.branch.uuid': deleteEmployeeDto.branchUuid,
    //                 'corporate.branch.role': UserRoles.branchAdmin,
    //             },
    //         ],
    //     });

    //     if(!verifyUser) throw new BadRequestException('User is not authorized');

    //     const findAndDeleteUser = await this.userModel.findOneAndDelete
    //     (
    //         { 
    //             uuid: deleteEmployeeDto.employeeUuid,
    //             'corporate.uuid': deleteEmployeeDto.corporateUuid,
    //         },

    //         { new: true },
    //     )

    //     return await findAndDeleteUser.save();
    // }

    // Update the code so that the super admin only needs to enter corporate email address
    // Check if user is already existed (Corporate Admin or Regular Corporate).
    async addCorporateAdmin(addCorporateAdminDto: AddCorporateAdminDto, request: any): Promise<any> {
        const verifyUser = await this.userModel.findOne
            ({
                uuid: request.userId,
                role: UserRoles.superAdmin,
            });

        if (!verifyUser) throw new BadRequestException('User is not authorized');

        const hash = await bcrypt.hash(addCorporateAdminDto.password, 10);

        addCorporateAdminDto.uuid = uuid();
        addCorporateAdminDto.password = hash;
        addCorporateAdminDto.role = UserRoles.corporate;

        for (let i = 0; i < addCorporateAdminDto.corporate.length; i++) {
            addCorporateAdminDto.corporate[i].role = UserRoles.corporateAdmin;
        }

        const newCorporateAdmin = new this.userModel(addCorporateAdminDto);
        return await newCorporateAdmin.save();
    }

    // Add validation if the corporate has existed or not through the their email address
    async addCorporate(addCorporateDto: AddCorporateDto, request: any): Promise<any> {
        const verifyUser = await this.userModel.findOne
            ({
                uuid: request.userId,
                role: UserRoles.superAdmin,
            });

        if (!verifyUser) throw new BadRequestException('User is not authorized');

        addCorporateDto.uuid = uuid();

        const newCorporate = new this.corporateModel(addCorporateDto);
        return await newCorporate.save();
    }

    async updateCorporate(updateCorporateDto: UpdateCorporateDto, request: any): Promise<any> {
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
                            'corporate.uuid': updateCorporateDto.uuid,
                            'corporate.role': UserRoles.corporateAdmin,
                        },
                    ],
            });

        if (!verifyUser) throw new BadRequestException('User is not authorized');

        const updatedInformation =
        {
            emailAddress: updateCorporateDto.emailAddress,
            headquartersAddress: updateCorporateDto.headquartersAddress,
            name: updateCorporateDto.name,
            country: updateCorporateDto.country,
        }

        Object.keys(updatedInformation).forEach
            (key => {

                if (updatedInformation[key] === null || updatedInformation[key] === '') {
                    delete updatedInformation[key];
                }
            });

        const updateCorporate = await this.corporateModel.findOneAndUpdate
            (
                { uuid: updateCorporateDto.uuid },
                updatedInformation,
                { new: true }
            );

        return await updateCorporate.save();
    }

    async updateCorporateBranch(updateCorporateBranchDto: UpdateCorporateBranchDto, request: any): Promise<any> {
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
                            'corporate.uuid': updateCorporateBranchDto.corporateUuid,
                            'corporate.role': UserRoles.corporateAdmin,
                        },
                        {
                            role: UserRoles.corporate,
                            'corporate.uuid': updateCorporateBranchDto.corporateUuid,
                            'corporate.branch.uuid': updateCorporateBranchDto.branchUuid,
                            'corporate.branch.role': UserRoles.branchAdmin,
                        },
                    ],
            });

        if (!verifyUser) throw new BadRequestException('User is not authorized');

        let startWorkingHours = new Date();
        startWorkingHours.setUTCHours(updateCorporateBranchDto.startWorkingHours_Hours, updateCorporateBranchDto.startWorkingHours_Minutes);

        let endWorkingHours = new Date();
        endWorkingHours.setUTCHours(updateCorporateBranchDto.endWorkingHours_Hours, updateCorporateBranchDto.endWorkingHours_Minutes);

        updateCorporateBranchDto.startWorkingHours = startWorkingHours;
        updateCorporateBranchDto.endWorkingHours = endWorkingHours;

        const updatedInformation =
        {
            emailAddress: updateCorporateBranchDto.emailAddress,
            branchAddress: updateCorporateBranchDto.branchAddress,
            name: updateCorporateBranchDto.name,
            offDays: updateCorporateBranchDto.offDays,
            startWorkingHours: updateCorporateBranchDto.startWorkingHours,
            endWorkingHours: updateCorporateBranchDto.endWorkingHours,
            startWorkingHours_Hours: updateCorporateBranchDto.startWorkingHours_Hours,
            startWorkingHours_Minutes: updateCorporateBranchDto.startWorkingHours_Minutes,
            endWorkingHours_Hours: updateCorporateBranchDto.endWorkingHours_Hours,
            endWorkingHours_Minutes: updateCorporateBranchDto.endWorkingHours_Minutes,
        }

        const objKeys = Object.keys(updatedInformation)
        objKeys.forEach
            (key => {
                if (
                    (
                        updatedInformation.startWorkingHours_Hours === null
                    )
                    ||
                    (
                        updatedInformation.startWorkingHours_Minutes === null
                    )
                    ||
                    (
                        updatedInformation.endWorkingHours_Hours === null
                    )
                    ||
                    (
                        updatedInformation.endWorkingHours_Minutes === null
                    )

                ) {
                    delete updatedInformation.startWorkingHours;
                    delete updatedInformation.endWorkingHours;
                }
                
                if (
                    (updatedInformation.startWorkingHours === undefined && updatedInformation.endWorkingHours === undefined) &&
                    (updatedInformation[key] === null || updatedInformation[key] === '')) {
                    delete updatedInformation[key];
                }
            });

        const updateCorporateBranch = await this.corporateBranchModel.findOneAndUpdate
            (
                { uuid: updateCorporateBranchDto.branchUuid, corporateUuid: updateCorporateBranchDto.corporateUuid },
                updatedInformation,
                { new: true }
            );

        return await updateCorporateBranch.save();
    }

    async addBranch(addBranchDto: AddBranchDto, request: any): Promise<any> {
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

        if (!verifyUser) throw new BadRequestException('User is not authorized');

        addBranchDto.uuid = uuid();

        const newCorporateBranch = new this.corporateBranchModel(addBranchDto);
        return await newCorporateBranch.save();
    }

    // async updateBranch( request: any): Promise<any>
    // {
    //     const verifyUser = await this.userModel.findOne
    //     ({ 
    //         uuid: request.userId,
    //         $or: 
    //         [
    //             {
    //                 role: UserRoles.superAdmin
    //             },
    //             {
    //                 role: UserRoles.corporate,
    //                 'corporate.uuid': updateEmployeeDto.corporateUuid,
    //                 'corporate.role': UserRoles.corporateAdmin,
    //             },
    //             {
    //                 role: UserRoles.corporate,
    //                 'corporate.uuid': updateEmployeeDto.corporateUuid,
    //                 'corporate.branch.uuid': updateEmployeeDto.branchUuid,
    //                 'corporate.branch.role': UserRoles.branchAdmin,
    //             },
    //         ],
    //     });

    //     if(!verifyUser) throw new BadRequestException('User is not authorized');
    // }
}
