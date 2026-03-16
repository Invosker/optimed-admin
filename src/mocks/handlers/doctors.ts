import { http, HttpResponse } from "msw";
import { mockDoctors } from "../data/doctors";

export const doctorHandlers = [
    http.get("*/doctors", () => {
        return HttpResponse.json({
            data: mockDoctors,
            _meta: {
                page_number: 1,
                page_size: 50,
                total_elements: mockDoctors.length,
                total_pages: 1,
            },
        });
    }),

    http.put("*/doctors/:id", async ({ request }) => {
        const body = await request.json() as Record<string, unknown>;
        return HttpResponse.json({ data: body, message: "Doctor actualizado" });
    }),

    http.post("*/doctors", async ({ request }) => {
        const body = await request.json() as Record<string, unknown>;
        return HttpResponse.json({ data: { id: Date.now(), ...body }, message: "Doctor creado" });
    }),
];