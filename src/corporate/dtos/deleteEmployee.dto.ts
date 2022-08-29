import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class DeleteEmployeeDto 
{
    @IsNotEmpty()
    @IsUUID(4)
    employeeUuid: string;

    @IsNotEmpty()
    @IsUUID(4)
    corporateUuid: string;

    @IsOptional()
    branchUuid: string;
}