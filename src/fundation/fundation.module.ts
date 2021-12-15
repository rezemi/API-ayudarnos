import { Module } from '@nestjs/common';
import { FundationController } from './fundation.controller';
import { FundationService } from './fundation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FundationSchema } from './schema/fundation.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Fundation',
        useFactory: () => {
          const schema = FundationSchema;
          schema.plugin(require('mongoose-paginate-v2'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [FundationController],
  providers: [FundationService]
})
export class FundationModule {}
