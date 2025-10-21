const express = require('express');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Endpoint para autenticación desde Bonita
router.post('/login', async (req, res) => {
  try {
    const { username, password, system } = req.body;

    // Validación básica
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username y password son requeridos'
      });
    }

    // Validar credenciales de Bonita (puedes personalizar esta lógica)
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
});

// Endpoint para validar token
router.post('/validate', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token requerido'
      });
    }

    const { verifyToken } = require('../middleware/auth');
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    res.json({
      success: true,
      message: 'Token válido',
      data: {
        user: decoded,
        isValid: true
      }
    });

  } catch (error) {
    console.error('Error validando token:', error);
    res.status(500).json({
      success: false,
      message: 'Error al validar token',
      error: error.message
    });
  }
});

module.exports = router;