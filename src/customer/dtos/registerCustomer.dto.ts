import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class RegisterCustomerDto
{
    uuid: string;

    @IsNotEmpty()
    @IsEmail()
    emailAddress: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    fullName: string;
    
    @IsNotEmpty()
    phoneNumber: string;

    role: string;
}