import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';
import { PaginationDto } from './dto/pagination.dto';

@Module({
    providers: [ AxiosAdapter],
    exports: [
        AxiosAdapter,
    ]
})
export class CommonsModule {}
