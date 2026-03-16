import { http, HttpResponse } from "msw";
import { mockUsers } from "../data/users";

export const userHandlers = [
    http.get("*/admins", () => {
        return HttpResponse.json({
            data: mockUsers,
            _meta: {
                page_number: 1,
                page_size: 50,
                total_elements: mockUsers.length,
                total_pages: 1,
            },
        });
    }),

    http.post("*/admins", async ({ request }) => {
        const body = await request.json() as Record<string, unknown>;
        return HttpResponse.json({ data: { id: Date.now(), ...body }, message: "Usuario creado" });
    }),
];  