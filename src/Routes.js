const express = require('express');
const routes = express.Router();

const authMiddleware = require('./middlewares/authe');//middleware para fazer verificação de token de login

const AccountsController = require('./controllers/AccountsController.js');//controller das "contas"
const ProjectController = require('./controllers/ProjectController.js');//controller do resto do site/projeto

routes.post('/register', AccountsController.register);//caminho e metodo q vai ser ultilizado nessa rota
routes.post('/auth', AccountsController.auth);

routes.get('/stores/',authMiddleware, ProjectController.list);
routes.get('/stores/:storeId',authMiddleware, ProjectController.listId);

routes.get('/products/',authMiddleware, ProjectController.listProducts);
routes.get('/products/:productId',authMiddleware, ProjectController.IdProduct);

routes.post('/products/',authMiddleware, ProjectController.create_updateProduct);
routes.delete('/products/:productId',authMiddleware, ProjectController.deleteProduct);

module.exports = routes;