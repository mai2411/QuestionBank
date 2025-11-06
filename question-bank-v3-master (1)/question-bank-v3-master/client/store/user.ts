import { create } from 'zustand'

export type User = {
  id: number
  username: string
  role: string
}

const defaultUser: User = {
  id: 0,
  username: '',
  role: ''
}

export type UserStore = {
  user: User
  setUser: (user: User) => void
  clearUser: () => void
  isAuthenticated: boolean
}

const useUserStore = create<UserStore>((set) => ({
  user: defaultUser,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: defaultUser, isAuthenticated: false }),
  isAuthenticated: false
}))

export default useUserStore
