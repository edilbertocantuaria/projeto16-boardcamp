import { db } from "../database/database.js";

export async function findGames(req, res) {
    try {
        const games = await db.query("SELECT * FROM games");
        if (games.rows.length === 0) return res.send("Nenhum jogo cadastrado");
        res.send(games.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }

};

export async function registerGame(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;

    try {
        const gameAlreadyRegistered = await db.query("SELECT * FROM games WHERE name=$1 ", [name]);
        console.log(gameAlreadyRegistered);
        if (gameAlreadyRegistered.rows.length != 0) return res.status(409).send("Jogo já cadastrado");

        await db.query(`INSERT INTO games ("name", "image", "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)`, [name, image, stockTotal, pricePerDay]);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


