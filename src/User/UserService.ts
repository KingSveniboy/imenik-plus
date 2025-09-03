import client from '../db';
import { Request, Response } from 'express';
import UserEntity from './UserEntity';
import Validator from '../Base/Validator';
import UserValidator from './UserValidator';

export class UserService {
    userValidator: Validator<UserEntity>;

    constructor() {
        this.userValidator = new UserValidator();
    }

    private setParams(req: Request) {
        const id = Number(req.params.id);
        const godine = Number(req.body.godine);
        const { ime, prezime, email } = req.body;

        const user: UserEntity = {
            id, godine, ime, prezime, email
        }

        return user
    }

    private returnResponse(res: Response, status: number, message: {}) {
        res.status(status).json(message);
        res.end();
    };

    private returnError(error: any, res: Response, status: number, message: {}) {
        console.error('Greška pri dohvaćanju korisnika: ', error);
        this.returnResponse(res, status, message);
    };

    getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await client.query('SELECT * FROM korisnik');
            this.returnResponse(res, 200, { data: users.rows, count: users.rowCount });
        } catch (error) {

            this.returnError(error, res, 500, { message: 'Greška: Nije moguće dohvatiti korisnike!' });
        }
    }

    createUser = async (req: Request, res: Response) => {
        const user = this.setParams(req);
        if (!this.userValidator.createDataValid(user)) {
            this.returnResponse(res, 400, { error: 'Greška: Krivi unos podataka' });
            return;
        }

        try {
            const users = await client.query(`insert into korisnik (ime, prezime, email, godine) values ($1, $2, $3, $4)`, [user.ime, user.prezime, user.email, user.godine]);
            this.returnResponse(res, 200, { "users": users.rows });
        } catch (error) {
            this.returnError(error, res, 500, { message: 'Greška: Nije moguć unos novog korisnika!' });
        }
    }

    getUserById = async (req: Request, res: Response) => {
        const user = this.setParams(req);
        if (!this.userValidator.idValidator(user)) {
            this.returnResponse(res, 400, { message: 'Greška: Unesite ispravan id korisnika!' });
            return;
        }

        try {
            const data = await client.query(`select * from korisnik where id=$1`, [user.id]);
            this.returnResponse(res, 200, { "korisnik": data.rows });
        } catch (error) {
            this.returnError(error, res, 500, { "Greška": error });
        }
    }

    updateUser = async (req: Request, res: Response) => {
        const user = this.setParams(req);
        if (!this.userValidator.updateDataValid(user)) {
            this.returnResponse(res, 400, { error: 'Invalid input data' });
            return;
        }

        try {
            const result = await client.query(
                'UPDATE korisnik SET ime = $1, prezime = $2, email = $3, godine = $4 WHERE id = $5 RETURNING *',
                [user.ime, user.prezime, user.email, user.godine, user.id]
            );

            if (result.rowCount === 0) {
                this.returnResponse(res, 404, { error: 'Korisnik nije pronađen' });
                return;
            }

            this.returnResponse(res, 200, result.rows[0]);
        } catch (error) {
            this.returnError(error, res, 500, { error: 'Internal server error' });
        }
    }

     deleteUser = async (req: Request, res: Response) => {
        const user = this.setParams(req);
        if (!this.userValidator.idValidator(user)) {
            this.returnResponse(res, 400, { message: 'Greška: Unesite ispravan id korisnika!' });
            return;
        }

        try {
            const existingUser = await client.query(`select * from korisnik where id=$1`, [user.id]);
            if (existingUser.rowCount === 0) throw Error("Korisnik ne postoji");
            await client.query(`delete from korisnik where id=$1`, [user.id]);
            this.returnResponse(res, 200, { "korisnik": existingUser.rows });
        } catch (error: any) {
            this.returnError(error, res, 500, { "Greška": error.message });
        }
    }
}







