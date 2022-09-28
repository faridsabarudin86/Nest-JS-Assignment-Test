import { IsEmail, IsString } from "class-validator";

export class TestCreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}