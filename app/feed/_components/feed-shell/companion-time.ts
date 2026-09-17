export function getCompanionTimeCopy(hour: number) {
  if (hour >= 5 && hour < 11) {
    return {
      greeting: "Chào buổi sáng lành.",
      nudge: "Ghi một điều nhỏ bạn muốn mang theo hôm nay.",
      label: "Buổi sáng",
    };
  }

  if (hour >= 11 && hour < 14) {
    return {
      greeting: "Chào buổi trưa an yên.",
      nudge: "Dừng 3 phút để cảm ơn một điều đã nâng đỡ bạn.",
      label: "Buổi trưa",
    };
  }

  if (hour >= 14 && hour < 18) {
    return {
      greeting: "Chào buổi chiều dịu nhẹ.",
      nudge: "Nhìn lại một khoảnh khắc đã làm ngày hôm nay sáng hơn.",
      label: "Buổi chiều",
    };
  }

  if (hour >= 18 && hour < 23) {
    return {
      greeting: "Chào buổi tối bình yên.",
      nudge: "Khép ngày bằng một lời biết ơn thật gần.",
      label: "Buổi tối",
    };
  }

  return {
    greeting: "Chào đêm khuya tĩnh lặng.",
    nudge: "Viết nhẹ thôi, đủ để lòng mình được đặt xuống.",
    label: "Đêm khuya",
  };
}
