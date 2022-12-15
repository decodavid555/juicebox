const {Client} = require('pg');

const client = new Client('postgres://localhost:5432/juicebox-dev');

async function getAllUsers() {
    const {rows} = await client.query(
        `SELECT id, username
        FROM users:
        `);
        return rows;
}

async function createUser({ username, password}) {
    try {
        const result = await client.query(`
        INSERT INTO users(username, passsword)
        VALUES ($1, $2);
        `, [username, password]);
        return result
    } catch (error) {
        throw error;
    }
}

module.exports = {
    client,
    getAllUsers,
    createUser,
}