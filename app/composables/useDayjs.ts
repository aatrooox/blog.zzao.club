import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import "dayjs/locale/zh-cn";

export default function useDayjs() {
  dayjs.extend(relativeTime)
  
  /**
   * 检测日期是否有效
   * @param date 日期字符串
   * @returns 
   */
  const checkDate = (date: string) => {
    return dayjs(date).isValid()
  }

  /**
   * 检测日期有效, 且更新日期距离创建日期超过1天(当天更新文章视为纠错)
   * @param updateDate 更新日期
   * @param createDate 创建日期
   * @returns 
   */
  const checkUpdate = (updateDate: string, createDate: string) => {
    return checkDate(updateDate) && dayjs(updateDate).diff(createDate, 'day') > 1
  }
  
  /**
   * 格式化日期: 2222年2月2日
   * @param date 日期字符串
   * @returns 
   */
  const formatDate = (date: string | Date, split?: string) => {
    if (split) {
      return dayjs(date).format(`YYYY${split}MM${split}DD`)
    } 
    return dayjs(date).format('YYYY年MM月DD日')
  }
  
  const formatFullDate = () => {
    return dayjs().format('YYYY/MM/DD HH:mm:ss')
  }
  /**
   * 获取更新时间距今经过了多久
   * @param updateTime 更新时间
   * @returns 
   */
  const updateDateFromNow = (updateTime: string | Date) => {
    return dayjs(updateTime).locale('zh-cn').fromNow();
  }

  return {
    checkDate,
    checkUpdate,
    formatDate,
    updateDateFromNow,
    formatFullDate
  }
}