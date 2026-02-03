/**
 * =============================================
 * AGENTE MCP - ESTILO CLASE SEMANA 12
 * =============================================
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { buildRLFilter } from "../middleware/rls.js"; // Importamos tu lógica de clase

// Inicializar Prisma
const prisma = new PrismaClient();

const server = new McpServer({
    name: "Servidor MCP Estudiantil",
    version: "1.0.0",
    description: "Agente consolidado Semanas 11 y 12"
});

/**
 * TOOL: obtener_datos_seguros
 * Implementa la lógica de RLS enseñada por el Licenciado
 */
server.tool(
    "consultar_mis_datos",
    "Consulta segura de datos privados. Aplica Middleware RLS.",
    {
        usuario_id: z.number().describe("ID del usuario"),
        rol: z.enum(["ESTUDIANTE", "ADMIN"]).describe("Rol del usuario")
    },
    async ({ usuario_id, rol }) => {
        // Usamos la lógica de clase: buildRLFilter
        const filter = buildRLFilter({ id: usuario_id, role: rol });

        console.error(`Aplicando RLS: ${filter.clause} con ID: ${usuario_id}`);

        try {
            const pedidos = await prisma.pedido.findMany({
                where: { id_cliente: usuario_id },
                include: { servicio: true }
            });

            return {
                content: [{
                    type: "text",
                    text: `[POLÍTICA RLS ACTIVA]:\n${JSON.stringify(pedidos, null, 2)}`
                }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error de base de datos: ${(error as Error).message}` }],
                isError: true
            };
        }
    }
);

// Iniciar servidor
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(">>> AGENTE MCP LISTO (ESTILO CLASE) <<<");
}

main().catch(console.error);

