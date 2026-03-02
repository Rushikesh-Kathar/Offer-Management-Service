import { Request, Response } from 'express';
import { createOffer, getallOffers, getOfferById, updateOfferById, deleteOfferById, getOfferBySearch } from '../services/offer.service'

export const createOfferController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { offer_name, description, discount_type, discount_value, start_date, end_date, status } = req.body;
        if (!offer_name || !description || !discount_type || !start_date || !end_date || !status) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        const result = await createOffer({
            offer_name,
            description,
            discount_type,
            discount_value,
            start_date,
            end_date,
            status
        });


        res.status(201).json({
            message: 'Offer created successfully',
            data: result

        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getAlloffersController = async (req: Request, res: Response): Promise<void> => {
    try {
        const offers = await getallOffers();
        res.status(200).json({
            message: 'offers retrived successfully',
            data: offers
        })
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getOfferByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string' || Array.isArray(id)) {
            res.status(400).json({ message: "Invalid offer ID" });
            return
        }

        const offers = await getOfferById(id);
        if (!offers) {
            res.status(404).json({ message: 'Offer not found' });
            return;
        }
        res.status(200).json({
            message: 'Offer retrived successfully',
            data: offers
        })

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const updateOfferByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            res.status(400).json({ message: "Invalid offer ID" });
            return;
        }
        const updateOffer = await updateOfferById(id, req.body);
        res.status(200).json({
            message: "Offer updated successfully",
            data: updateOffer
        })
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteOfferByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            res.status(400).json({ message: 'Invalid offer ID' });
            return;
        }
        await deleteOfferById(id);
        res.status(200).json({
            message: "Offer deleted successfully"
        })

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getOfferBySearchController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { offer_name, discount_type, discount_value, start_date, end_date, status } = req.query;

        if (Array.isArray(offer_name) || Array.isArray(discount_type) || Array.isArray(discount_value) || Array.isArray(start_date) || Array.isArray(end_date) || Array.isArray(status)) {
            res.status(400).json({ message: "Invalid query parameters" });
            return;
        }
        const offers = await getOfferBySearch({
            offer_name: typeof offer_name === "string" ? offer_name : undefined,
            discount_type: typeof discount_type === "string" ? discount_type : undefined,
            discount_value: typeof discount_value === "string" ? Number(discount_value) : undefined,
            start_date: typeof start_date === "string" ? new Date(start_date) : undefined,
            end_date: typeof end_date === "string" ? new Date(end_date) : undefined,
            status: typeof status === "string" ? status : undefined,
        });
        res.status(200).json({
            message: 'offers retrieved successfully',
            count: offers.length,
            data: offers
        })
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const activateOfferByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            res.status(400).json({ message: "Invalid offer ID" });
            return;
        }
        const updateOffer = await updateOfferById(id, req.body);
        res.status(200).json({
            message: "Offer activated successfully",
            data: updateOffer
        })
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}