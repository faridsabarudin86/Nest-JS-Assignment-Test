import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateCustomerDto
{
    @IsOptional()
    emailAddress: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsString()
    @IsOptional()
    fullName: string;
    
    @IsOptional()
    phoneNumber: string;
}