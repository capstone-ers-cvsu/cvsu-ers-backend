const mongoose = require("mongoose");

const Model = require("./officials.model");

const GetOfficials = async (req, res) => {
    try {
        const { id, archive } = req.query;

        const faqs = await Model.find({
            $and: [
                { isArchived: archive },
                { office: id }
            ]
        }).populate({
            path: 'created_by',
            select: 'name',
        }).populate({
            path: 'updated_by',
            select: 'name',
        }).sort({ updatedAt: -1 });

        res.status(200).json(faqs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const CreateOfficials = async (req, res) => {
    try {
        const { id, group_id } = req.query;
        const data = req.body;

        const result = await Model.create({ ...data, created_by: id, office: group_id })

        res.status(201).json({ message: 'Data created', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const EditOfficials = async (req, res) => {
    try {
        const doc_id = req.params.id;
        const id = req.query.id;
        const data = req.body;

        const result = await Model.findByIdAndUpdate(
            { _id: doc_id },
            {
                $set: {
                    ...data,
                    updated_by: id
                }
            },
            { new: true }
        )

        res.status(200).json({ message: 'Data edited successfully', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const ArchiveOfficials = async (req, res) => {
    try {

        const { ids, archived, updated_by } = req.body;

        const result = await Model.updateMany(
            { _id: { $in: ids } },
            {
                $set: {
                    isArchived: archived,
                    updated_by: updated_by,
                }
            },
            { new: true }
        );

        res.status(200).json({ message: 'Archived successfully', result });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
module.exports = {
    GetOfficials,
    CreateOfficials,
    EditOfficials,
    ArchiveOfficials,
};
