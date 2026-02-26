import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import 'dayjs/locale/zh-cn'

export default function useDayjs() {
  dayjs.extend(relativeTime)
  const checkDate = (date: string | Date) => {
    return dayjs(date).isValid()
  }

  // 检测日期有效, 且更新日期距离创建日期超过1天(当天更新文章视为纠错)
  const checkUpdate = (updateDate: string | Date, createDate: string | Date) => {
    return checkDate(updateDate) && dayjs(updateDate).diff(createDate, 'day') > 0
  }

  // 格式化日期: 2222年2月2日
  const formatDate = (date: string | Date, split?: string, short?: boolean) => {
    if (split) {
      return dayjs(date).format(short ? `YY${split}MM${split}DD` : `YYYY${split}MM${split}DD`)
    }
    return dayjs(date).format(short ? 'YYYY/MM/DD' : 'YY/MM/DD')
  }

  const formatFullDate = (date: string | Date) => {
    return dayjs(date ?? new Date()).format('YYYY/MM/DD HH:mm:ss')
  }
  // 获取更新时间距今经过了多久
  const updateDateFromNow = (updateTime: string | Date) => {
    return dayjs(updateTime).locale('zh-cn').fromNow()
  }

  const formatDateTime = (date: string | Date) => {
    return dayjs(date ?? new Date()).format('YYYY-MM-DD HH:mm')
  }

  return {
    checkDate,
    checkUpdate,
    formatDate,
    formatDateTime,
    updateDateFromNow,
    formatFullDate,
  }
}
