import prisma from "@@/lib/prisma"

export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(event, z.object({
    name: z.string(),
    url: z.string(),
    desc: z.string(),
  }))

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: JSON.stringify(body.error)
    })
  }

  const { feishuWebhook, feishuUserId } = useRuntimeConfig()
  // 发送飞书通知
  $fetch(feishuWebhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "msg_type": "post",
      "content": {
          "post": {
              "zh_cn": {
                  "title": "友链申请",
                  "content": [
                      [
                      {
                          "tag": "text",
                          "text": "有新申请: "
                      }, 
                      {
                          "tag": "text",
                          "text": `${body.data.name} - ${body.data.desc}`
                      },
                      {
                        "tag": "a",
                        "text": "查看网站",
                        "href": body.data.url
                      }, 
                      {
                          "tag": "at",
                          "user_id": feishuUserId
                      }
                    ]
                  ]
              }
          }
      }
    })
  })

  return {
    msg: '已通知博主'
  }
})