function buildRLFilter(user: { id: number, role: string }) {
    if (user.role === "ADMIN") {
        return { clause: "1=1", params: [] };
    }
    // En Prisma usamos objetos, pero simulamos la lógica de la clausula para que la expliques igual
    return { clause: "id_usuario = ?", params: [user.id] };
}

async function verifyOwnership(prisma: any, table: string, recordId: number, userId: number) {
    // Adaptación de la lógica de clase para que funcione con tu proyecto actual
    const record = await prisma[table].findFirst({
        where: {
            id: recordId,
            id_usuario: userId
        }
    });
    return !!record;
}

export { buildRLFilter, verifyOwnership };
