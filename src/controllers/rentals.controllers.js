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
            returnDate: (rental.returnDate===null?  null : new Date (rental.returnDate).toISOString().split('T')[0]),
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
        const customer = await db.query("SELECT * FROM customers WHERE id=$1 ORDER BY id ASC", [customerId]);
        if (customer.rows.length === 0) return res.status(400).send("ID do cliente não encontrado");

        const game = await db.query("SELECT * FROM games WHERE id=$1 ", [gameId]);
        if (game.rows.length === 0) return res.status(400).send("ID do jogo não encontrado");

        if (daysRented <= 0) return res.status(400).send("O dia de aluguel do jogo deve ser maior que zero");

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

export async function updatingRentalByID(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.sendStatus(400);

    try {
        const rental = await db.query("SELECT * FROM rentals WHERE id=$1 ", [id]);
        if (rental.rows.length === 0) return res.status(404).send("Aluguel não encontrado");

        //if (rental.rows[0].returnDate != null) return res.status(400).send("Aluguel já finalizado!");

        const currentDate = new Date()
        const returnDate = new Date(currentDate.toISOString().split("T")[0]);
        console.log(currentDate);
        console.log(returnDate);
        const formattedReturnDate = returnDate.toISOString().split("T")[0];
        console.log(formattedReturnDate);
        const startingRentDate = new Date(rental.rows[0].rentDate.toISOString().split("T")[0]);

        const timeDiff = Math.abs(returnDate.getTime() - startingRentDate.getTime());
        const daysLater = Math.ceil(timeDiff / (1000 * 3600 * 24));

        console.log(daysLater);

        let delayFee;
        if (daysLater > rental.rows[0].daysRented) {
            delayFee = daysLater * rental.rows[0].originalPrice;
        } else {
            delayFee = null;
        }

        await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3 `, [formattedReturnDate, delayFee, id]);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function deleteRental(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.sendStatus(400);

    try {
        const rental = await db.query("SELECT * FROM rentals WHERE id=$1 ", [id]);
        if (rental.rows.length === 0) return res.status(404).send("Aluguel não encontrado");

        if (rental.rows[0].returnDate === null) return res.status(400).send("Aluguel não finalizado!");

        await db.query(`DELETE FROM rentals WHERE id=$1 `, [id]);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
