import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsUUID } from "class-validator";

export class GetBranchesDto 
{
    @IsUUID(4)
    corporateUuid: string;
}