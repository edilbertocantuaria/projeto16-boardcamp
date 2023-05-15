import { db } from "../database/database.js";

export async function findCustomers(req, res) {
    try {
        const customers = await db.query("SELECT * FROM customers");
        if (customers.rows.length === 0) return res.status(400).send("Nenhum cliente cadastrado");
        res.send(customers.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }

};

export async function findCustomerByID(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.sendStatus(400);

    try {
        const customers = await db.query("SELECT * FROM customers WHERE id=$1", [id]);
        if (customers.rows.length === 0) return res.status(400).send("Nenhum cliente cadastrado com este ID");
        res.send(customers.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }

};

export async function registerCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const customerAlreadyRegistered = await db.query("SELECT * FROM customers WHERE cpf=$1 ", [cpf]);

        if (customerAlreadyRegistered.rows.length != 0) return res.status(409).send("Cliente já cadastrado");

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, [name.trim(), phone.trim(), cpf.trim(), birthday]);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export async function updatingCustomerByID(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    const id = Number(req.params.id);
    if (isNaN(id)) return res.sendStatus(400);

    try {
        const customers = await db.query("SELECT * FROM customers WHERE id=$1", [id]);
        if (customers.rows.length === 0) return res.send("Nenhum cliente cadastrado com este ID");

        await db.query("UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5", [name.trim(), phone.trim(), cpf.trim(), birthday, id]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
};
