import express from 'express';
import { 
    dashboard,
    categories,
    categoryAdd,
    categorySave,
    categoryEdit,
    categoryDelete,
    products,
    productAdd,
    productSave,
    productEdit,
    productDelete,
    productCsv,
    settings,
    settingAdd,
    settingSave,
    settingEdit,
    orders,
    users,
    editUser,
    BlockUser,
    UnBlockUser,
    saveUser,
    orderView,
    slider,
    sliderAdd,
    sliderEdit,
    sliderDelete,
    sliderSave
 } from '../controllers/admin.controller.js';
import adminAuth from '../middleware/AdminAuth.middleware.js'

const router = express.Router();

router.get('/dashboard',adminAuth, dashboard);


router.get('/categories',adminAuth, categories);
router.get('/category-add',adminAuth, categoryAdd);
router.post('/category-save',adminAuth, categorySave);
router.get('/category-edit',adminAuth, categoryEdit);
router.get('/category-delete',adminAuth, categoryDelete);



router.get('/products',adminAuth, products);
router.get('/product-add',adminAuth, productAdd);
router.post('/product-save',adminAuth, productSave);
router.get('/product-edit',adminAuth, productEdit);
router.get('/product-delete',adminAuth, productDelete);
router.post('/product-csv',adminAuth, productCsv);

router.get('/settings',adminAuth, settings);
router.get('/setting-add',adminAuth, settingAdd);
router.get('/setting-edit',adminAuth, settingEdit);
router.post('/settings-save',adminAuth, settingSave);



router.get('/orders',adminAuth, orders);
router.get('/order-view',adminAuth, orderView);




router.get('/users',adminAuth, users);
router.get('/user-edit',adminAuth, editUser);
router.post('/user-save',adminAuth, saveUser);
router.get('/user-block',adminAuth, BlockUser);
router.get('/user-unblock',adminAuth, UnBlockUser);


router.get('/slider',adminAuth, slider);
router.get('/slider-add',adminAuth, sliderAdd);
router.get('/slider-edit',adminAuth, sliderEdit);
router.get('/slider-delete',adminAuth, sliderDelete);
router.post('/slider-save',adminAuth, sliderSave);



export default router;