export function isMissingTimezoneColumn(message: string) {
  return message.includes("timezone") && (message.includes("schema cache") || message.includes("column"));
}
