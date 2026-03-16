import { authHandlers } from "./handlers/auth";
import { appointmentHandlers } from "./handlers/appointments";
import { doctorHandlers } from "./handlers/doctors";
import { inventoryHandlers } from "./handlers/inventory";
import { userHandlers } from "./handlers/users";
import { salesHandlers } from "./handlers/sales";

export const handlers = [
    ...authHandlers,
    ...appointmentHandlers,
    ...doctorHandlers,
    ...inventoryHandlers,
    ...userHandlers,
    ...salesHandlers,
];