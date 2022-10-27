import { Router } from "express";
import * as rc from './controller/register.js';
import validation from './../../middleware/validation.js';
import * as validators from './auth.validator.js';
const router = Router()

router.post('/signup',validation(validators.signup) ,rc.signup)
router.get('/confirmEmail/:token',validation(validators.confirmEmail) , rc.confirmEmail)
router.get('/reConfirmEmail/:token',validation(validators.refreshToken) , rc.refreshToken)
router.post('/signin',validation(validators.signin) , rc.signin)

export default  router