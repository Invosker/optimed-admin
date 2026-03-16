
import { UserProvider } from '@/GlobalContexts/UserContext/Context';
import { CombineContext } from './CombineContext';
const providers = [
    UserProvider,
]
export const AppContextProvider = CombineContext(...providers);