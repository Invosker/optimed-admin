import { http, HttpResponse } from "msw";

const MOCK_SESSION = {
    access_token: "mock-token-optimed-demo",
    expires_in: 86400,
    user: {
        id: 1,
        username: "admin",
        name: "Ivan",
        lastName: "Rivas",
        email: "admin@optimed.com",
        roleId: 1,
        isSuperAdmin: true,
        status: 1,
        isActive: true,
        role: {
            id: 1,
            roleName: "Administrador",
            active: true,
            permissions: JSON.stringify([
                { moduleKey: "myAccount", actions: [{ actionKey: "view", active: true, selected: true }] },
                { moduleKey: "audit", actions: [{ actionKey: "view", active: true, selected: true }] },
                {
                    moduleKey: "inventory", actions: [
                        { actionKey: "view", active: true, selected: true },
                        { actionKey: "edit", active: true, selected: true },
                        { actionKey: "delete", active: true, selected: true },
                    ]
                },
                {
                    moduleKey: "newService", actions: [
                        { actionKey: "sales", active: true, selected: true },
                        { actionKey: "medicalAppointment", active: true, selected: true },
                    ]
                },
                {
                    moduleKey: "medicalAppointments", actions: [
                        { actionKey: "view", active: true, selected: true },
                        { actionKey: "edit", active: true, selected: true },
                    ]
                },
                {
                    moduleKey: "doctors", actions: [
                        { actionKey: "view", active: true, selected: true },
                        { actionKey: "edit", active: true, selected: true },
                    ]
                },
                {
                    moduleKey: "clients", actions: [
                        { actionKey: "view", active: true, selected: true },
                        { actionKey: "edit", active: true, selected: true },
                    ]
                },
                { moduleKey: "billing", actions: [{ actionKey: "view", active: true, selected: true }] },
                { moduleKey: "reports", actions: [{ actionKey: "view", active: true, selected: true }] },
                {
                    moduleKey: "configuration", actions: [
                        { actionKey: "products", active: true, selected: true },
                        { actionKey: "categories", active: true, selected: true },
                        { actionKey: "subcategories", active: true, selected: true },
                        { actionKey: "users", active: true, selected: true },
                        { actionKey: "roles", active: true, selected: true },
                    ]
                },
                { moduleKey: "profile", actions: [] },
            ]),
        },
    },
};

export const authHandlers = [
    http.post("*/auth/admin/login", () => {
        return HttpResponse.json({
            status: 200,
            message: "Login exitoso",
            errors: [],
            data: MOCK_SESSION, // ← ApiResponse.data contiene { access_token, user }
        });
    }),
];