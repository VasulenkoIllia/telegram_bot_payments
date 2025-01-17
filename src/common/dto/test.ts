import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class TestDTO {
	@IsEmail()
	@ApiProperty({ required: true })
	public email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(128)
	@ApiProperty({ required: true })
	public password: string;
}
