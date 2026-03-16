import { http, HttpResponse } from "msw";
import { mockInventory } from "../data/inventory";

export const inventoryHandlers = [
    http.get("*/inventory/all", () => {
        return HttpResponse.json({
            data: mockInventory,
        });
    }),

    http.get("*/inventory", ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page") ?? 1);
        const limit = Number(url.searchParams.get("limit") ?? 10);
        const filterRaw = url.searchParams.get("filter");
        const search = filterRaw
            ? JSON.parse(filterRaw)?.name?.toLowerCase() ?? ""
            : "";

        let filtered = mockInventory;

        if (search) {
            filtered = filtered.filter((i) =>
                i.name.toLowerCase().includes(search) ||
                i.sku.toLowerCase().includes(search)
            );
        }

        const start = (page - 1) * limit;
        const docs = filtered.slice(start, start + limit);

        return HttpResponse.json({
            data: docs,
            _meta: {
                page_number: page,
                page_size: limit,
                total_elements: filtered.length,
                total_pages: Math.ceil(filtered.length / limit),
            },
        });
    }),

    http.put("*/inventory/:id", async ({ request }) => {
        const body = await request.json() as Record<string, unknown>;
        return HttpResponse.json({ data: body, message: "Item actualizado" });
    }),
];