import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsUUID } from "class-validator";

export class GetAllEmployeeDto 
{
    @IsUUID(4)
    corporateUuid: string;

    @IsUUID(4)
    branchUuid: string;
}