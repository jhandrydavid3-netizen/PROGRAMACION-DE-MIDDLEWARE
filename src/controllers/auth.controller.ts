import { FastifyReply, FastifyRequest } from 'fastify';
import { LoginDTO } from '../models/auth.js';

export const AuthController = {
    async login(request: FastifyRequest, reply: FastifyReply) {
        const { email, contrasena } = request.body as LoginDTO;

        // Buscar al usuario por email
        const usuario = await request.server.prisma.usuario.findUnique({
            where: { email }
        });

        if (!usuario) {
            return reply.status(401).send({ message: 'Credenciales inválidas' });
        }

        // Verificar contraseña (TODO: Usar hashing como bcrypt en producción)
        if (usuario.contrasena !== contrasena) {
            return reply.status(401).send({ message: 'Credenciales inválidas' });
        }

        if (!usuario.activo) {
            return reply.status(403).send({ message: 'Usuario inactivo' });
        }

        // Generar token simulado (TODO: Usar @fastify/jwt)
        const token = `mock-token-${usuario.id_usuario}-${Date.now()}`;

        return {
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                email: usuario.email,
                nombre: `${usuario.nombre} ${usuario.apellido}`,
                rol: usuario.rol
            }
        };
    }
};
