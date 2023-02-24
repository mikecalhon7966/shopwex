import express from 'express';
import { 
    homePageSection,
    getCategories,
    getCategoryById,
    getProducts,
    getProductById,
    getProductsByCategories,
    getTopProducts,
    getProductBySearch,
    placeOrder,
    homePageSlides,
    myOrder,
    myOrders,
    getByCategories
} from '../controllers/api.controller.js';

import auth from '../middleware/Auth.middleware.js'

const router = express.Router();


router.get('/home-page-sections',homePageSection);
router.get('/home-page-slides',homePageSlides);
router.get('/categories',getCategories);
router.get('/category/:id',getCategoryById);




router.get('/products',getProducts);
router.get('/product/:id',getProductById);
router.post('/productsByCategories',getProductsByCategories);
router.post('/products-by-categories',getByCategories);

router.get('/top-product',getTopProducts);
router.get('/search',getProductBySearch);

router.post('/place-order',auth,placeOrder);
router.get('/my-orders',auth,myOrders);
router.get('/order/:id',auth,myOrder);


export default router;