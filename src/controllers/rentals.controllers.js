import { db } from "../database/database.js";

export async function findRentals(req, res) {
    try {
        let rentals = await db.query(`
            SELECT rentals.*,
                customers.id AS customer_id,
                customers.name AS customer_name,
                games.id AS game_id,
                games.name AS game_name
            FROM rentals
            JOIN customers ON rentals."customerId" = customers.id
            JOIN games ON rentals."gameId" = games.id
        `);

        if (rentals.rows.length === 0) {
            return res.status(404).send("Nenhum aluguel cadastrado");
        }

        const formattedRentals = rentals.rows.map((rental) => ({
            id: rental.id,
            customerId: rental.customerId,
            gameId: rental.gameId,
            rentDate: new Date(rental.rentDate).toISOString().split('T')[0],
            daysRented: rental.daysRented,
            returnDate: rental.returnDate,
            originalPrice: rental.originalPrice,
            delayFee: rental.delayFee,
            customer: {
                id: rental.customer_id,
                name: rental.customer_name,
            },
            game: {
                id: rental.game_id,
                name: rental.game_name,
            }
        }));

        res.send(formattedRentals);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function registerRental(req, res) {
    let { customerId, gameId, daysRented } = req.body;

    try {
        const customer = await db.query("SELECT * FROM customers WHERE id=$1 ", [customerId]);
        if (customer.rows.length === 0) return res.status(400).send("ID do cliente não encontrado");

        const game = await db.query("SELECT * FROM games WHERE id=$1 ", [gameId]);
        if (game.rows.length === 0) return res.status(400).send("ID do jogo não encontrado");

        if (daysRented === 0) return res.status(400).send("O dia de aluguel do jogo deve ser maior que zero");

        const gameStock = game.rows[0].stockTotal;

        const rentedGames = await db.query(`SELECT COUNT(*) FROM rentals WHERE "gameId"= $1 AND "returnDate" IS NULL`, [gameId]);
        const rentedGamesCount = parseInt(rentedGames.rows[0].count);
        if (rentedGamesCount >= gameStock) {
            return res.status(400).send("Não há jogos disponíveis para aluguel");
        }

        const rentDate = new Date().toISOString().split("T")[0];
        const originalPrice = daysRented * game.rows[0].pricePerDay;

        await db.query(
            `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") VALUES ($1, $2, $3, $4, $5)`,
            [customerId, gameId, rentDate, daysRented, originalPrice]
        );
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


