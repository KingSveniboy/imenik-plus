import client from '../db';
import { Request, Response } from 'express';
import Validator from '../Base/Validator';
import PostValidator from './PostValidator';
import { PostEntity } from './PostEntity';

export class PostService {
    postValidator: Validator<PostEntity>;

    constructor() {
        this.postValidator = new PostValidator();
    }

    private setParams(req: Request) {
        const id = Number(req.params.id);
        const userId = Number(req.body.userId);
        const { naslov, sadrzaj } = req.body;
        const updatedAt = new Date();

        const post: PostEntity = {
            id, naslov, sadrzaj, userId, updatedAt, createdAt: undefined
        }

        return post
    }

    private returnResponse(res: Response, status: number, message: {}) {
        res.status(status).json(message);
        res.end();
    };

    private returnError(error: any, res: Response, status: number, message: {}) {
        console.error('Greška pri dohvaćanju korisnika: ', error);
        this.returnResponse(res, status, message);
    };

    getAllPosts = async (req: Request, res: Response) => {
        try {
            const posts = await client.query(`
                SELECT o.*, k.ime, k.prezime 
                FROM objave o
                JOIN korisnik k ON o.user_id = k.id
                ORDER BY o.created_at DESC
            `);

            this.returnResponse(res, 200, { data: posts.rows, count: posts.rowCount });
        } catch (error) {

            this.returnError(error, res, 500, { message: 'Greška: Nije moguće dohvatiti objave!' });
        }
    }

    createPost = async (req: Request, res: Response) => {
        const data = this.setParams(req);
        if (!this.postValidator.createDataValid(data)) {
            this.returnResponse(res, 400, { error: 'Greška: Krivi unos podataka' });
            return;
        }

        try {
            const post = await client.query(`insert into objave (naslov, sadrzaj, user_id) values ($1, $2, $3)`, [data.naslov, data.sadrzaj, data.userId]);
            this.returnResponse(res, 200, { "posts": post.rows });
        } catch (error) {
            this.returnError(error, res, 500, { message: 'Greška: Nije moguć unos nove objave!' });
        }
    }

    getPostById = async (req: Request, res: Response) => {
        const data = this.setParams(req);
        if (!this.postValidator.idValidator(data)) {
            this.returnResponse(res, 400, { message: 'Greška: Unesite ispravan id objave!' });
            return;
        }

        try {
            const post = await client.query(`
                SELECT o.*, k.ime, k.prezime 
                FROM objave o
                JOIN korisnik k ON o.user_id = k.id
                WHERE o.id = $1
                ORDER BY o.created_at DESC
            `, [data.id]
            );
            this.returnResponse(res, 200, { "objava": post.rows });
        } catch (error) {
            this.returnError(error, res, 500, { "Greška": error });
        }
    }

    updatePost = async (req: Request, res: Response) => {
        const data = this.setParams(req);
        if (!this.postValidator.updateDataValid(data)) {
            this.returnResponse(res, 400, { error: 'Invalid input data' });
            return;
        }

        try {
            const post = await client.query(
                'UPDATE objave SET naslov = $1, sadrzaj = $2, user_id = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
                [data.naslov, data.sadrzaj, data.userId, data.id]
            );

            if (post.rowCount === 0) {
                this.returnResponse(res, 404, { error: 'Objava nije pronađena' });
                return;
            }

            this.returnResponse(res, 200, post.rows[0]);
        } catch (error) {
            this.returnError(error, res, 500, { error: 'Internal server error' });
        }
    }

    deletePost = async (req: Request, res: Response) => {
        const data = this.setParams(req);
        if (!this.postValidator.idValidator(data)) {
            this.returnResponse(res, 400, { message: 'Greška: Unesite ispravan id objave!' });
            return;
        }

        try {
            const existingPost = await client.query(`select * from objave where id = $1`, [data.id]);
            if (existingPost.rowCount === 0) throw Error("Objava ne postoji");
            await client.query(`delete from objave where id = $1`, [data.id]);
            this.returnResponse(res, 200, { "objava": existingPost.rows });
        } catch (error: any) {
            this.returnError(error, res, 500, { "Greška": error.message });
        }
    }
}







