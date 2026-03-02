import { Router } from 'express';
import { createOfferController, getAlloffersController, getOfferByIdController, updateOfferByIdController, deleteOfferByIdController, getOfferBySearchController, activateOfferByIdController, deactivateOfferByIdController } from '../controllers/offer.controller';

const router = Router();
router.route('/offer').post(createOfferController);
router.route('/offer').get(getAlloffersController);
router.route('/offer/search').get(getOfferBySearchController);
router.route('/offer/:id').get(getOfferByIdController);
router.route('/offer/:id').patch(updateOfferByIdController);
router.route('/offer/:id').delete(deleteOfferByIdController);
router.route('/offers/:id/activate').patch(activateOfferByIdController);
router.route('/offers/:id/deactivate').patch(deactivateOfferByIdController);



export default router;