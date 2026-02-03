import { FastifyReply, FastifyRequest } from 'fastify';
import { UsuarioDTO } from '../models/usuario.js';

export const UsuarioController = {
    async getAll(request: FastifyRequest, reply: FastifyReply) {
        const usuarios = await request.server.prisma.usuario.findMany({
            include: { carrera: true }
        });
        return usuarios;
    },

    async getById(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const usuario = await request.server.prisma.usuario.findUnique({
            where: { id_usuario: parseInt(id) },
            include: { carrera: true, servicios: true }
        });
        if (!usuario) return reply.status(404).send({ message: 'Usuario no encontrado' });
        return usuario;
    },

    async create(request: FastifyRequest, reply: FastifyReply) {
        const body = request.body as UsuarioDTO;
        const nuevoUsuario = await request.server.prisma.usuario.create({
            data: {
                email: body.email,
                contrasena: body.contrasena,
                nombre: body.nombre,
                apellido: body.apellido,
                telefono: body.telefono,
                id_carrera: body.id_carrera,
                rol: body.rol || 'CLIENTE'
            }
        });
        return reply.status(201).send(nuevoUsuario);
    },

    async updateStatus(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const { activo } = request.body as { activo: boolean };
        const usuario = await request.server.prisma.usuario.update({
            where: { id_usuario: parseInt(id) },
            data: { activo }
        });
        return usuario;
    },

    async updateMe(request: FastifyRequest, reply: FastifyReply) {
        const id_usuario = parseInt(request.headers['x-usuario-id'] as string || '0');
        const body = request.body as Partial<UsuarioDTO>;

        // Evitar cambios de rol o ID por parte del cliente
        delete body.rol;
        delete body.id_usuario;

        const usuario = await request.server.prisma.usuario.update({
            where: { id_usuario },
            data: body
        });
        return usuario;
    }
};
