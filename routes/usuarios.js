const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos } = require("../middlewares/validar-campos");
const { esRoleValido, emailExiste, usuarioExistePorId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');



const router = Router();

router.get('/', usuariosGet);

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('correo', 'El correo es inválido').isEmail(),
        check('correo').custom( emailExiste ),
        check('password', 'El password debe de ser más de 6 letras').isLength({min: 6}),
        //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('rol').custom( esRoleValido ),
        validarCampos,
], usuariosPost);

router.put('/:id',[
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(usuarioExistePorId),
        check('rol').custom( esRoleValido ),
        validarCampos,
], usuariosPut);

router.delete('/:id',[
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(usuarioExistePorId),
        validarCampos,
], usuariosDelete);

router.patch('/', usuariosPatch);



module.exports = router;