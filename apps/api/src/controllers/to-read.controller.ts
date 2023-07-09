import { Knex } from "knex";

interface ToReadDto {
    url: string
    name?: string
    created_at: number
    updated_at: number
}

interface CreateToReadDto {
    url: string
    name?: string
}

interface UpdateToReadDto {
    url?: string
    name?: string
    readed?: string
}

type Controller = {
    index: (db: Knex) => Promise<ToReadDto[]>
    create: (db: Knex, createToReadDto: CreateToReadDto) => Promise<ToReadDto>
    update: (db: Knex, updateToReadDto: UpdateToReadDto, url: string) => Promise<number>
}
const controller: Controller = {
    index: async (db) => 
        await db('to_read').select('*'),
    create: async (db, createToReadDto) => 
        await db('to_read').insert(createToReadDto),
    update: async (db, updateToReadDto, url) => 
        await db('to_read').update(updateToReadDto).where('url', url),
}

export default controller;