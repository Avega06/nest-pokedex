import { IsInt, IsOptional, IsPositive, Min } from "class-validator"

export class PaginationDto {

    @IsPositive()
    @IsOptional()
    @Min(1)
    offset?: number

    @IsPositive()
    @IsOptional()
    limit?: number
}