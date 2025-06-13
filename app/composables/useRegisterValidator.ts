import { z } from 'zod'

export default function useRegisterValidator() {
  const validateEmail = (email: string) => {
    const emailSchema = z.string().email()
    try {
      emailSchema.parse(email)
      return true
    }
    catch {
      return false
    }
  }

  const validatePassword = (password: string) => {
    const passwordSchema = z.string().min(6)
    try {
      passwordSchema.parse(password)
      return true
    }
    catch {
      return false
    }
  }

  const validateUsername = (username: string) => {
    const usernameSchema = z.string().min(6)
    try {
      usernameSchema.parse(username)
      return true
    }
    catch {
      return false
    }
  }

  return {
    validateEmail,
    validatePassword,
    validateUsername,
  }
}
