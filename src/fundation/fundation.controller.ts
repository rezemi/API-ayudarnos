import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Query, Res } from '@nestjs/common';
import { FundationDTO } from './dto/fundation.dto';
import { FundationService } from './fundation.service';

@Controller('fundation')
export class FundationController {

    constructor(
        private readonly fundationService: FundationService
    ) { }

    @Post('/addFundationOrCooperative')
    async createNewFundationOrCoperative(@Res() res, @Body() user: FundationDTO) {
        const newUser = await this.fundationService.createFundationOrCooperative(user)
        return res.status(HttpStatus.OK).json(newUser)
    }

    @Put('/updateFundation')
    async updateUser(@Res() res, @Body() user: FundationDTO, @Query('idFundation') id) {
        const updateUser = await this.fundationService.upDateFundation(id, user);
        if (!updateUser) throw new NotFoundException('Error al actualizar usuario')
        return res.status(HttpStatus.OK).json({
            message: "Usuario updated Successfully",
            updateUser
        })
    };

    @Get('/fundationPagination')
    async getCasesPagination(@Res() res, @Query('limit') limit, @Query('page') page){
        const fundations = await this.fundationService.getFundationWithPagination(limit, page)
        return res.status(HttpStatus.OK).json(fundations);
    }

    @Get('/allFundation')
    async getFundations(@Res() res){
        const fundations = await this.fundationService.getAllFundations()
        return res.status(HttpStatus.OK).json(fundations);
    }

    @Get('/:fundationID')
    async getAsingleCase(@Res() res, @Param('fundationID') fundationID) {
        const fundation = await this.fundationService.getFundation(fundationID);
        if (!fundation) throw new NotFoundException('Case does not exist!');
        return res.status(HttpStatus.OK).json(fundation);
    }

    @Delete('/delete')
    async deleteAsingleCase(@Res() res,  @Query('fundationID') fundationID){
        const fundation = await this.fundationService.deleteFundation(fundationID);
        if (!fundation) throw new NotFoundException('Case does not exist!');
        return res.status(HttpStatus.OK).json({
            message: 'Case Deleted Successfully',
            fundation 
        });
    }
}
