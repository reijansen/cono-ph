import { sql } from "../config/db.js";

export const getAllSpecies = async (req, res) => {
    try {
        const allSpecies = await sql`
            SELECT * FROM species
            ORDER BY created_at DESC;
        `;

        console.log("Succesfully retrieved all species!");

        res.status(200).json({
            success: true,
            data: allSpecies,
            message: "Succesfully fetched data.",
        });
    } catch (error) {
        console.log("getSpecies Error");
        res.status(500).json({
            success: false,
            message: "SERVER ERROR: failed to retrieve all species",
        });
    }
};

export const createSpecies = async (req, res) => {
    const { scientific_name, common_name, num_related_publications } = req.body;

    if (!scientific_name || !common_name || !num_related_publications) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    try {
        const newSpecies = await sql`
            INSERT INTO species (scientific_name, common_name, num_related_publications)
            VALUES (${scientific_name},${common_name},${num_related_publications})
            RETURNING *
        `;

        console.log(
            "Succesfully created new species: " +
                JSON.stringify(newSpecies[0].scientific_name)
        );

        res.status(201).json({
            success: true,
            data: newSpecies[0], // json is returned wrapped in a list so need to access via index
            message: "New species created",
        });
    } catch (error) {
        console.log("createSpecies error", error);
        res.status(500).json({
            success: false,
            message: "SERVER ERROR: " + error.message,
        });
    }
};

export const getSpecies = async (req, res) => {
    const { id } = req.params;

    try {
        const fetchedSpecies = await sql`
            SELECT * FROM species where species_id=${id}
        `;

        res.status(200).json({
            success: true,
            data: fetchedSpecies[0],
            message: "Succesfully retrieved species",
        });
    } catch (error) {
        console.log("getSpecies Error", error);
        res.status(500).json({
            success: false,
            message: "SERVER ERROR: failed to retrieve species",
        });
    }
};

export const updateSpecies = async (req, res) => {
    const { id } = req.params;
    const { name, price, image } = req.params;

    try {
        const updatedSpecies = await sql`
            UPDATE species
            SET name=${name}, price=${price}, image=${image}
            WHERE id=${id}
            RETURNING *
        `;

        if (updatedSpecies.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Species not found.",
            });
        }

        console.log("Succesfully updated species");
        res.status(200).json({
            success: true,
            data: updateSpecies[0],
            message: "Succesfully updated species",
        });
    } catch (error) {
        console.log("updateSpecies error", error);
        res.status(500).json({
            success: false,
            message: "SERVER ERROR: " + error.message,
        });
    }
};

export const deleteSpecies = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSpecies = await sql`
            DELETE FROM species WHERE id=${id}
            RETURNING *
        `;

        if (deletedSpecies.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Species not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: deletedSpecies[0],
            message: "Succesfully deleted species",
        });
    } catch (error) {
        console.log("Error in deleteSpecies", error);
        res.status(500).json({
            success: false,
            message: "SERVER ERROR: " + error.message,
        });
    }
};
