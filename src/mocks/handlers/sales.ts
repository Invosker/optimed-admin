import { http, HttpResponse } from "msw";

const mockSales = [
    {
        id: 1,
        createdAt: "2025-03-10T10:30:00Z",
        total: 145.00,
        status: "Completada",
        paymentMethod: "Efectivo",
        client: { firstName: "María", lastName: "González", identification: "V-12345678" },
        items: [
            { name: "Lentes de Contacto Blandos", quantity: 2, salePrice: 45.00 },
            { name: "Solución Multiusos 360ml", quantity: 1, salePrice: 14.00 },
        ],
    },
    {
        id: 2,
        createdAt: "2025-03-11T14:00:00Z",
        total: 120.00,
        status: "Completada",
        paymentMethod: "Tarjeta",
        client: { firstName: "Pedro", lastName: "Ramírez", identification: "V-87654321" },
        items: [
            { name: "Armazón Titanio Ref. T-200", quantity: 1, salePrice: 120.00 },
        ],
    },
    {
        id: 3,
        createdAt: "2025-03-12T09:15:00Z",
        total: 28.00,
        status: "Completada",
        paymentMethod: "Transferencia",
        client: { firstName: "Laura", lastName: "Martínez", identification: "V-11223344" },
        items: [
            { name: "Solución Multiusos 360ml", quantity: 2, salePrice: 14.00 },
        ],
    },
];

const mockClients = [
    {
        id: 1,
        firstName: "María",
        lastName: "González",
        identification: "V-12345678",
        identificationType: "V",
        phone: "+58 412 555 0010",
        email: "maria.gonzalez@email.com",
        birthDate: "1990-05-15",
        isActive: true,
    },
    {
        id: 2,
        firstName: "Pedro",
        lastName: "Ramírez",
        identification: "V-87654321",
        identificationType: "V",
        phone: "+58 414 555 0020",
        email: "pedro.ramirez@email.com",
        birthDate: "1985-08-22",
        isActive: true,
    },
    {
        id: 3,
        firstName: "Laura",
        lastName: "Martínez",
        identification: "V-11223344",
        identificationType: "V",
        phone: "+58 416 555 0030",
        email: "laura.martinez@email.com",
        birthDate: "1995-03-10",
        isActive: true,
    },
];

export const salesHandlers = [
    http.get("*/sales", ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page") ?? 1);
        const limit = Number(url.searchParams.get("limit") ?? 10);
        const start = (page - 1) * limit;
        const docs = mockSales.slice(start, start + limit);

        return HttpResponse.json({
            data: docs,
            _meta: {
                page_number: page,
                page_size: limit,
                total_elements: mockSales.length,
                total_pages: Math.ceil(mockSales.length / limit),
            },
        });
    }),

    http.post("*/sales", async ({ request }) => {
        const body = await request.json() as Record<string, unknown>;
        return HttpResponse.json({
            data: { id: Date.now(), ...body },
            message: "Venta registrada",
        });
    }),

    http.get("*/clients/identification/:id", ({ params }) => {
        const id = params.id as string;
        const client = mockClients.find((c) => c.identification === id);
        return HttpResponse.json({ data: client ?? null });
    }),

    http.get("*/clients", () => {
        return HttpResponse.json({ data: mockClients });
    }),

    http.post("*/clients", async ({ request }) => {
        const body = await request.json() as Record<string, unknown>;
        return HttpResponse.json({
            data: { id: Date.now(), ...body },
            message: "Cliente creado",
        });
    }),
];