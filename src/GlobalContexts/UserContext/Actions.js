import { USER_SET } from './Constants'

export function setUser(userData, password){ return { type: USER_SET, userData, password } }