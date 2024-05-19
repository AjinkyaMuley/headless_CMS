const express = require("express");
const cors = require("cors")
const pool = require("./database.js")

const app = express();

app.use(express.json())
app.use(cors());

app.post('/adduser/:entityName', async (req, res) => {
    const { id, ...data } = req.body; // Ignore the 'id' attribute
    const table = req.params.entityName;

    try {
        let keys = Object.keys(data).filter(key => data[key] !== '');
        let values = Object.values(data).filter(value => value !== '');

        console.log(keys, values)
        const queryText = `INSERT INTO ${table} (${keys.join(', ')}) VALUES(${keys.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`;
        const result = await pool.query(queryText, values);
        res.status(201).json(result.rows[0]); // Send back the newly added data
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});




app.post('/addentity', (req, res) => {
    const { name, attributes } = req.body;
    const createTableQuery = `CREATE TABLE ${name} (${attributes.map(attr => `${attr.name} ${attr.type === 'string' ? 'text' : attr.type === 'number' ? 'numeric' : attr.type}`).join(', ')},id SERIAL)`;

    pool.query(createTableQuery).then((response) => {
        console.log("table created ")
        console.log(response);
    })
        .catch((err) => {
            console.log(err)
        })

    res.send(req.body)
})

app.put('/data/:entityName/:id', async (req, res) => {
    const entityName = req.params.entityName;
    const id = req.params.id;
    const newData = req.body;

    try {
        // Build the UPDATE query dynamically
        const columnsToUpdate = Object.keys(newData).map((key, index) => `${key} = $${index + 1}`).join(', ');
        const values = Object.values(newData);
        const query = `UPDATE ${entityName} SET ${columnsToUpdate} WHERE id = $${values.length + 1}`;
        values.push(id);

        // Execute the query
        const result = await pool.query(query, values);

        res.status(200).json({ message: 'Entry updated successfully' });
    } catch (error) {
        console.error('Error updating entry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/delete/:table/:id', async (req, res) => {
    const table = req.params.table;
    const id = req.params.id;

    if (!table || !id) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const deleteQuery = `DELETE FROM ${table} WHERE id = $1`;

    try {
        const result = await pool.query(deleteQuery, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        res.json({ message: 'Delete successful', rowsAffected: result.rowCount });
    } catch (error) {
        console.error('Error executing delete query:', error);
        res.status(500).json({ error: 'An error occurred while deleting the entry' });
    }
});

app.get('/data/:table', async (req, res) => {
    const table = req.params.table;

    if (!table) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const selectQuery = `SELECT * FROM ${table} ORDER BY id ASC`;

    try {
        const result = await pool.query(selectQuery);
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing select query:', error);
        res.status(500).json({ error: 'An error occurred while fetching the data' });
    }
});

app.get('/entities', async (req, res) => {
    const selEntity = `SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position;
    `

    const dataTypeMapping = {
        "character varying": "string",
        "integer": "number",
        "numeric": "number"
    };

    try {

        const response = await pool.query(selEntity);
        const result = response.rows.reduce((acc, { table_name, column_name, data_type }) => {

            // Check if the table_name already exists in the accumulator
            let table = acc.find(item => item.name === table_name);

            // If the table doesn't exist, create a new entry for it
            if (!table) {
                table = { name: table_name, attributes: [] };
                acc.push(table);
            }

            // Add the column_name and data_type to the attributes array
            table.attributes.push({
                name: column_name,
                type: dataTypeMapping[data_type] || data_type
            });

            return acc;
        }, []);

        res.send(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('Error executing select entities:', error);
        res.status(500).json({ error: 'An error occurred while fetching the data' });
    }

})

app.delete('/deleteEntities/:name', async (req, res) => {
    const { name } = req.params;
    try {
        await pool.query(`DROP TABLE ${name}`);
        res.status(204).send();
    } catch (error) {
        console.log('Error deleting entity', error);
        res.status(500).send('Server error');
    }
})

app.listen(4000, () => console.log("server on localhost 4000"))
