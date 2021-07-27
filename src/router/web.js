import express from 'express';

import homeController from '../controllers/homeController'
import userController from '../controllers/userController'

let router = express.Router()

let initWebRouter = (app) => {
    // home controller 
    router.get('/', homeController.getHomePage)
    router.get('/crud', homeController.getCRUD)

    router.post('/post-crud',homeController.postCRUD)
    router.get('/get-crud',homeController.displayGetCRUD)
    router.get('/edit-crud',homeController.getEditCRUD)
    router.post('/put-crud', homeController.putCRUD)
    router.get('/delete-crud', homeController.deleteCRUD)

    // viết api cho project react 
    router.post('/api/login', userController.handleLogin)// api check xác thực user khi login
    router.get('/api/get-all-user', userController.handleGetAllUser)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/edit-user',userController.handleEditUser)
    router.delete('/api/delete',userController.handleDeleteUser)

    
    return app.use('/', router)
}

module.exports = initWebRouter 