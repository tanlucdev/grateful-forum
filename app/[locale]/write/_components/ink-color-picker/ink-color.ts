export function hsvToHex(hue: number, saturation: number, value: number) {
  const channel = (offset: number) => {
    const position = (offset + hue / 60) % 6;
    return Math.round(255 * value * (1 - saturation * Math.max(0, Math.min(position, 4 - position, 1)))).toString(16).padStart(2, "0");
  };
  return `#${channel(5)}${channel(3)}${channel(1)}`.toUpperCase();
}

export function hexToHsv(hex: string) {
  const [red, green, blue] = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const value = Math.max(red, green, blue);
  const delta = value - Math.min(red, green, blue);
  const hue = !delta ? 0 : value === red ? ((green - blue) / delta + 6) % 6 : value === green ? (blue - red) / delta + 2 : (red - green) / delta + 4;
  return { hue: hue * 60, saturation: value ? delta / value : 0, value };
}
