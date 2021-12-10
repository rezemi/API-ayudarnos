import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { caseController } from './case.controller';
import { CaseService } from './case.service';
import { CaseSchema } from './schema/case.schema';
import mongoosePaginate from 'mongoose-paginate-v2';

@Module({
  /* imports: [MongooseModule.forFeature([{name: 'Case', schema: CaseSchema}])], */
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Case',
        useFactory: () => {
          const schema = CaseSchema;
          schema.plugin(require('mongoose-paginate-v2'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [caseController],
  providers: [CaseService]
})
export class CasenModule {}
