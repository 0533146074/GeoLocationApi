const express = require("express");
const router = express.Router();
const pool = require("../db/db");

const distance = require('google-distance');
distance.apiKey = 'AIzaSyBxvqGxEvb6ZBnyRTM8isBU_6O-MAfuNiQ';

router.get('/distance?:origin?:destination', async (req, res) => {
    var origin = req.query.origin;
    var destination = req.query.destination;
    try {
        var distanceRes = await pool.query(
            "SELECT * FROM distance_tbl WHERE origin=$1 and destination=$2 or origin=$2 and destination=$1",
            [origin, destination]
        );
        if (distanceRes.rows.length == 0) {
            distance.get(
                {
                    origins: [origin],
                    destinations: [destination],
                    language: ['iw']
                },
                function (err, data) {
                    if (err) {
                        res.json(null);
                    }
                    else {
                        const distanceKM = data[0].distance.match(/\d+(\.\d+)?/g).join("");
                        pool.query(
                            "INSERT INTO distance_tbl (origin, destination, distance_km, search_counter) VALUES ($1, $2, $3, $4) RETURNING *",
                            [origin, destination, distanceKM, 1],
                            function (error, result) {
                                if (!error) {
                                    res.json(result.rows[0].distance_km);
                                }
                                else {
                                    console.log(error);
                                }
                            }
                        );
                    }
                }
            )
        }
        else {
            distanceRes = await pool.query(
                "UPDATE distance_tbl SET search_counter = $1 WHERE distance_id = $2 RETURNING *",
                [distanceRes.rows[0].search_counter + 1, distanceRes.rows[0].distance_id]
            );
            res.json(distanceRes.rows[0].distance_km);
        }
    }
    catch (error) {
        console.error(error.message)
    }
});

module.exports = router;