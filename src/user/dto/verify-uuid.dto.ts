import { IsNotEmpty,  IsUUID } from 'class-validator';
import { ApiProperty  } from '@nestjs/swagger';

export class VerifyUuidDto {
    @ApiProperty ({
        description: 'uuid to verify user',
        format: 'uuid',
        uniqueItems: true,
      })
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty()
    readonly verification: string;
}
