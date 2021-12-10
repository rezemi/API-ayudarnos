import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { caseDto } from './dto/case.dto';
import { Case } from './interface/case.interface';


@Injectable()
export class CaseService {

    constructor(
        @InjectModel('Case') private readonly caseModel: Model<Case>,
        @InjectModel('Case') private readonly caseModelPagination: PaginateModel<Case>,
    ){}

    async getCasesWithPagination(limit: number, page: number): Promise<PaginateResult<Case>> {
        const cases = await this.caseModelPagination.paginate({}, { limit, page });
        return cases
    }

    //Post a single case
    async createCase(caseDTO: caseDto): Promise<Case> {
        const aCase = new this.caseModel(caseDTO);
        return await aCase.save();
    }

    //get a sinlge case
    async getCase(caseID: String): Promise<Case> {
        const aCase = await this.caseModel.findById(caseID);
        return aCase;
    }

    //Get a limit cases
    async getLimitCases(limit:number): Promise<Case[]> {
        const cases = await this.caseModel.find().limit(limit);
        return cases;
    }

    //Get all actives cases
    async getAllactiveCases(): Promise<Case[]> {
        const cases = await this.caseModel.find({ finished: false });
        return cases;
    }

    //Get all inactives cases
    async getAllinactiveCases(): Promise<Case[]> {
        const cases = await this.caseModel.find({ finished: true });
        return cases;
    }

    //Put a single case
    async updateCase(caseID: String, caseDTO: caseDto): Promise<Case> {
        const updatedCase = await this.caseModel.findByIdAndUpdate(caseID, caseDTO, {new: true});
        return updatedCase;
    }

    //Delete a single case
    async deleteCase(id: String): Promise<any> {
        const aCase = await this.caseModel.findOneAndDelete(id);
        return aCase;
    }
}
