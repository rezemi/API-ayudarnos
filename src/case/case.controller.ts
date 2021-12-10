import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Query, Res } from '@nestjs/common';
import { CaseService } from './case.service';
import { caseDto } from './dto/case.dto';

@Controller('case')
export class caseController {

    constructor(private caseService: CaseService){}

    //Get all active cases: /cases/
    @Get('/active')
    async getActiveCases(@Res() res){
        const cases = await this.caseService.getAllactiveCases();
        if (!cases) throw new NotFoundException('Case does not exist!');
        return res.status(HttpStatus.OK).json(cases);
    }

    //Get all inactive cases: /cases/
    @Get('/inactive')
    async getinActiveCases(@Res() res){
        const cases = await this.caseService.getAllinactiveCases();
        if (!cases) throw new NotFoundException('Case does not exist!');
        return res.status(HttpStatus.OK).json(cases);
    }

    @Get('/casePagination')
    async getCasesPagination(@Res() res, @Query('limit') limit, @Query('page') page){
        const cases = await this.caseService.getCasesWithPagination(limit, page)
        return res.status(HttpStatus.OK).json(cases);
    }

    // Add case: /case/create
    @Post('/create')
    async createCase(@Res() res, @Body() caseDTO: caseDto) {
        const aCase = await this.caseService.createCase(caseDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Case Successfully Created',
            aCase
        });
    }

    // Get a single case: /case/:caseID
    @Get('/:caseID')
    async getAsingleCase(@Res() res, @Param('caseID') caseID){
        const aCase = await this.caseService.getCase(caseID);
        if (!aCase) throw new NotFoundException('Case does not exist!');
        return res.status(HttpStatus.OK).json(aCase);
    }

    // Get cases limit: /cases/:limit
    @Get('/limit/:limit')
    async getCasesLimit(@Res() res, @Param('limit') limit){
        const cases = await this.caseService.getLimitCases(limit);
        if (!cases) throw new NotFoundException('Case does not exist!');
        return res.status(HttpStatus.OK).json(cases);
    }

    //Update case: /case/update?caseID=1234
    @Put('/update')
    async upDateAcase(@Res() res, @Body() caseDTO: caseDto, @Query('caseID') caseID){
        const updatedCase = await this.caseService.updateCase(caseID, caseDTO);
        if (!updatedCase) throw new NotFoundException('Case does not exist!');
        return res.status(HttpStatus.OK).json({
            message: 'Case Updated Successfully',
            updatedCase 
        });
    }

    //Delete a case: /delete?caseID=1234
    @Delete('/delete')
    async deleteAsingleCase(@Res() res,  @Query('caseID') caseID){
        const deletedCase = await this.caseService.deleteCase(caseID);
        if (!deletedCase) throw new NotFoundException('Case does not exist!');
        return res.status(HttpStatus.OK).json({
            message: 'Case Deleted Successfully',
            deletedCase 
        });
    }
        
}
