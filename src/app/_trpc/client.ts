import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter} from "@/server/index"; // command k and command i to show type coming out of the server 

export const trpc = createTRPCReact<AppRouter>({});