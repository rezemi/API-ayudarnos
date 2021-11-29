import { ApiProperty } from "@nestjs/swagger";

export class caseDto {
    @ApiProperty({
        example: 'Una operacion para Santino',
        description: 'Una operacion para Santino',
        format: 'description'
    })
    readonly title: string;
    readonly subTitle: string;
    readonly description: string;
    readonly imgURL?: string;
    readonly cbu: string;
    readonly alias: string;
    readonly cuil: string;
    readonly expectedMoney: number;
}