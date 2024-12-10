const jwt = require('jsonwebtoken');
const { STATUS, ALERTS } = require('../config/constants'); // Si usas constantes como te sugerí antes

const validarJWT = (req, res, next) => {
    // Leer el Token
    const token = req.header('x-token');

    // Si no existe el token
    if (!token) {
        return res.status(401).json({
            status: STATUS.ERROR,
            alert: 'No hay token en la petición',
            response: null,
        });
    }

    try {
        // Verificar y decodificar el token
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        // Validar que el uid es un ObjectId de MongoDB válido
        if (!uid || !/^[0-9a-fA-F]{24}$/.test(uid)) {
            return res.status(400).json({
                status: STATUS.ERROR,
                alert: ALERTS.INVALID_USER_ID,
                response: null,
            });
        }

        // Agregar el uid al request para usarlo en las rutas
        req.user = { id: uid };
        req.uid = uid;

        // Continuar con el flujo
        console.log('id: ' + uid);
        next();

    } catch (error) {
        // Error en la verificación del token
        return res.status(401).json({
            status: STATUS.ERROR,
            alert: 'Token no válido',
            response: null,
        });
    }
};

module.exports = {
    validarJWT
};
