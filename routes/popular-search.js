const express = require("express");
const app = express();
const router = express.Router();
const pool = require("../db/db");

router.get('/popular-search', async (req, res) => {
    try {
        var popularSearch = await pool.query(
            "SELECT origin, destination, search_counter FROM distance_tbl ORDER BY search_counter DESC LIMIT 1"
        );
        res.json(popularSearch.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})

router.get('/popular-search-list', async (req, res) => {
    try {
        var popularSearchList = await pool.query(
            "SELECT origin, destination, search_counter FROM distance_tbl ORDER BY search_counter DESC LIMIT 5"
        );
        res.json(popularSearchList.rows)
    }
    catch (error) {
        console.error(error.message)
    }
});

module.exports = router;