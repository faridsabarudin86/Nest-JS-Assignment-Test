import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class SignInDto {
    
    @IsEmail()
    @IsNotEmpty()
    emailAddress: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}