import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

import { Pokemon } from './entities/pokemon.entity';

import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { of } from 'rxjs';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService { 
  constructor(
    @InjectModel( Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();    

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
      
    } catch (error) {
      this.handleExeptions(error);
    }
  }

  async findAll({limit= 10, offset = 0}: PaginationDto) {
    
    return await this.pokemonModel.find()
    .limit(+limit)
    .skip(+offset)
    .select('-__v');
  }

  async findOne(term: string) {
    let pokemon :Pokemon;

    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no: term});
    }

    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }

    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase()});
    }

    if(!pokemon) throw new NotFoundException(`Pokemon with '${term}' not found`);

    return  pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pkmnDb = await this.findOne(term);
      
      if(updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      
      await pkmnDb.updateOne(updatePokemonDto);
  
      return {...pkmnDb.toJSON(), ...updatePokemonDto};
      
    } catch (error) {
      this.handleExeptions(error);
    }
  }

  async remove(id: string) {
    const {deletedCount, acknowledged} = await this.pokemonModel.deleteOne({_id : id})
    
    if(deletedCount === 0 ) 
      throw new BadRequestException(`The pokemon with id: ${id} not exist in the database`);
    
    return;
  }

  private handleExeptions(error: any) {
    if (error.code === 11000) throw new BadRequestException(`Pokemon already exists: ${JSON.stringify(error.keyValue)}`);

    console.log(error)
    throw new InternalServerErrorException(`Cant't update Pokemon - check server logs`);
  }
}
