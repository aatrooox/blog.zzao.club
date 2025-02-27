import * as jose from 'jose'
import prisma from '@@/lib/prisma'
// 登录接口, 获取jwt token
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // 将此key加入到payload中 请求时校验有无此key及user信息
  const { nuxtSecretKey, jwtSecret, cookie } = useRuntimeConfig(event)
  console.log(`jwtSecret`, jwtSecret)
  const { username, password } = body
  const secret = new TextEncoder().encode(jwtSecret)
  const user = await prisma.user.findUnique({
    where: {
      username
    }
  })

  if (!user) {
    throw createError('用户不存在')
  }

  if (user.password !== password) {
    throw createError('账号或密码错误')
  }

  const isProd = process.env.NODE_ENV === 'production'
  const payload = {
    userId: user.id,
    role: user.role,
    nuxtKey: nuxtSecretKey,
  }

  // console.log(`login-payload`, payload)
  const token = await new jose.SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('30d').sign(secret)
  
  setCookie(event, 'token', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 2592000, // maxAge 优先级高， expires 受客户端时间的影响
    secure: true,
    domain: cookie.domain,
  })
  
  return {
    data: {
      token,
      user
    },
    msg: '登录成功'
  }
})