import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class userUpdateDto {
    @ApiProperty()
    readonly socialMedia?: [String];

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    @ApiProperty()
    readonly fullName?: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    @ApiProperty()
    readonly name?: string;
    
    @ApiProperty()
    readonly imgURL?: string;

    //if user is fundation
    @ApiProperty()
    readonly webURL?: string;

    @ApiProperty()
    readonly provincia?: string;

    @ApiProperty()
    readonly adress?: string;

    @ApiProperty()
    readonly tel?: [number];
}