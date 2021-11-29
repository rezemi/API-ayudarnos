import { IsNotEmpty, MinLength, MaxLength, IsEmail, IsString } from 'class-validator';
import { ApiProperty  } from '@nestjs/swagger';

export class CreateUserDto {

    // fullName
    @ApiProperty({
      example: 'Nacho Alvarez',
      description: 'El nombre del usuario',
      format: 'cadena de sitrg',
      minLength: 6,
      maxLength: 255,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly fullName: string;

    // Email
     @ApiProperty({
      example: 'nacho@gmail.com',
      description: 'el email del usuario',
      format: 'email',
      uniqueItems: true,
      minLength: 5,
      maxLength: 255,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    @IsEmail()
    readonly email: string;

    // Password
    @ApiProperty({
      example: 'contraseña secreta!',
      description: 'una contraseña',
      format: 'string',
      minLength: 5,
      maxLength: 1024,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(1024)
    readonly password: string;

    //name
    @ApiProperty({
      example: 'nombre de usuario',
      description: 'The name of the User',
      format: 'string',
      minLength: 6,
      maxLength: 255,
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(255)
    readonly name: string;

    @ApiProperty({
      example:'unicef.com.ar',
      description:'una direccion web de la fundacion',
    })
    readonly webURL?: string;

    @ApiProperty({
      example:'Cordoba',
      description:'donde se esncuentra la fundacion',
    })
    readonly provincia?: string;

    @ApiProperty({
      example:'calle correintes 654654',
      description:'una direccion exacta de la fundacion',
    })
    readonly adress?: string;

    @ApiProperty({
      example:'011 654654',
      description:'telefonos de la fundacion',
    })
    readonly tel?: [number];
  }
