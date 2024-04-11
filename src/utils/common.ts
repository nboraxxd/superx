import { addSeconds, differenceInSeconds } from 'date-fns'

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Tính số giây chênh lệch giữa một thời điểm (iat) và hiện tại sau khi thêm vào số giây (secondsToAdd).
 * @param iat Thời điểm ban đầu (iat) tính bằng giây tính từ Epoch.
 * @param secondsToAdd Số giây cần thêm vào thời điểm ban đầu (iat).
 * @returns Số giây chênh lệch giữa thời điểm sau khi thêm vào và thời điểm hiện tại.
 */
export function calculateSecondsDifference(iat: number, secondsToAdd: number): number {
  // Chuyển epoch time thành đối tượng Date
  const iatDate = new Date(iat * 1000)

  // Lấy thời gian hiện tại
  const currentDate = new Date()

  // Cộng thêm số giây (secondsToAdd) vào thời gian iat
  const futureDateAfterAddition = addSeconds(iatDate, secondsToAdd)

  // Tính khoảng cách giây giữa thời gian iat + số giây (secondsToAdd) và thời gian hiện tại
  return differenceInSeconds(futureDateAfterAddition, currentDate)
}
