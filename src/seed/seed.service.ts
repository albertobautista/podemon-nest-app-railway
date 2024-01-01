import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    // const insertPromisesArray = [];
    const pokemonToInsert: { name: string; no: number }[] = [];

    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=151',
    );

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const pokemonNo: number = +segments[segments.length - 2];

      pokemonToInsert.push({ name, no: pokemonNo });
      // insertPromisesArray.push(
      //   this.pokemonModel.create({ name, no: pokemonNo }),
      // );
      // await this.pokemonModel.create({ name, no: pokemonNo });
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    // await Promise.all(insertPromisesArray);

    return 'Seed completed!';
  }
}
