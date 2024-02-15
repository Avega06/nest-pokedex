import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.inteface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly axios: AxiosAdapter
  ) { }

  
  
  async executeSeed() {
    await this.pokemonModel.deleteMany()

    const data = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=800')
    
    const pokemonToInsert: {name: string, no:number}[] = []
    
    data.results.forEach(async({name , url}) => {
      const segments = url.split('/')
      const no = +segments.at(segments.length - 2)

      //await this.pokemonModel.create({name, no})
      pokemonToInsert.push({name, no})
    })
    
    await this.pokemonModel.insertMany(pokemonToInsert)
    return 'Seed executed';
  }

}
