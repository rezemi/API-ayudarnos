import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { caseController } from './case.controller';
import { CaseService } from './case.service';
import { CaseSchema } from './schema/case.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Case', schema: CaseSchema}])],
  controllers: [caseController],
  providers: [CaseService]
})
export class CasenModule {}
