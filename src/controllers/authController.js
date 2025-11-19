const { generateToken, verifyToken } = require('../middleware/auth');

const authController = {
  // Autenticación de usuario
  login: async (req, res) => {
    try {
      const { username, password, system } = req.body;

      // Validación básica
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username y password son requeridos'
        });
      }

      // Validar credenciales de Bonita
      const validCredentials = [
        { username: 'bonita_user', password: 'bonita_pass', role: 'bonita_system' },
        { username: 'api_user', password: 'api_pass', role: 'api_client' },
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'walter.bates', password: 'bpm', role: 'user' }
      ];

      const user = validCredentials.find(
        cred => cred.username === username && cred.password === password
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }

      // Generar token con información del usuario
      const tokenPayload = {
        username: user.username,
        role: user.role,
        system: system || 'bonita',
        iat: Math.floor(Date.now() / 1000)
      };

      const token = generateToken(tokenPayload, '24h');

      res.json({
        success: true,
        message: 'Autenticación exitosa',
        data: {
          token,
          user: {
            username: user.username,
            role: user.role,
            system: system || 'bonita'
          },
          expiresIn: '24h'
        }
      });

    } catch (error) {
      console.error('Error en autenticación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

};

module.exports = authController;
