import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { FundationDTO } from './dto/fundation.dto';
import { Fundation } from './interface/fundation.interface';

@Injectable()
export class FundationService {

    constructor(
        @InjectModel('Fundation') private readonly fundationModel: Model<Fundation>,
        @InjectModel('Fundation') private readonly fundationModelPagination: PaginateModel<Fundation>) {
    }

    //retorna todas las fundaciones paginadas
    async getFundationWithPagination(limit: number, page: number): Promise<PaginateResult<Fundation>> {
        const fundation = await this.fundationModelPagination.paginate({}, { limit, page });
        return fundation
    }

    //crear una fundacion
    async createFundationOrCooperative(user: FundationDTO): Promise<Fundation> {
        const userForC = new this.fundationModel(user);
        await userForC.save()
        return userForC
    }

    //actualizar una
    async upDateFundation(id: number, user: FundationDTO): Promise<Fundation>{
        const userUpdated = await this.fundationModel.findOneAndUpdate({ _id: id }, user, { new: true });
        return userUpdated;
    }

    //eliminar una
    async deleteFundation(id: string): Promise<any>{
        const fundation = await this.fundationModel.findOneAndDelete( { _id: id } );
        return fundation;
    }

    //retornar una
    async getFundation(id: String): Promise<Fundation> {
        const fundation = await this.fundationModel.findById( { _id: id } );
        return fundation;
    }
}
