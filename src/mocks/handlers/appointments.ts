import { http, HttpResponse } from "msw";
import { mockAppointments } from "../data/appointments";

export const appointmentHandlers = [
    http.get("*/appointments", ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page") ?? 1);
        const limit = Number(url.searchParams.get("limit") ?? 10);
        const search = url.searchParams.get("search")?.toLowerCase() ?? "";
        const status = url.searchParams.get("status") ?? "";

        let filtered = mockAppointments;

        if (search) {
            filtered = filtered.filter(
                (a) =>
                    a.client?.firstName.toLowerCase().includes(search) ||
                    a.client?.lastName.toLowerCase().includes(search) ||
                    a.doctor?.name.toLowerCase().includes(search)
            );
        }

        if (status) {
            filtered = filtered.filter((a) => a.status === status);
        }

        const start = (page - 1) * limit;
        const docs = filtered.slice(start, start + limit);
        const totalDocs = filtered.length;
        const totalPages = Math.ceil(totalDocs / limit);

        return HttpResponse.json({
            data: docs,
            _meta: {
                page_number: page,
                page_size: limit,
                total_elements: totalDocs,
                total_pages: totalPages,
            },
        });
    }),

    http.put("*/appointments/:id", async ({ request }) => {
        const body = await request.json() as Record<string, unknown>;
        return HttpResponse.json({ data: body, message: "Cita actualizada" });
    }),
];