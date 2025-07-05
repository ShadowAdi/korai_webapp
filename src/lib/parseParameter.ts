export function parseParameters(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  let patientName = "";
  let date = "";
  const parameters = [];

  for (const line of lines) {
    if (line.startsWith("Patient Name:")) {
      patientName = line.split(":")[1].trim();
    } else if (line.startsWith("Date:")) {
      date = line.split(":")[1].trim();
    } else {
      const match = line.match(
        /^(.*?):\s*([\d.]+)\s*(\w+\/\w+).*?(\d+)[^0-9]*(\d+)?/
      );
      if (match) {
        const [, name, valueStr, unit, minStr, maxStr] = match;
        parameters.push({
          name: name.trim(),
          value: parseFloat(valueStr),
          unit: unit.trim(),
          normalMin: minStr ? parseFloat(minStr) : null,
          normalMax: maxStr ? parseFloat(maxStr) : null,
        });
      }
    }
  }
  return { patientName, date, parameters };
}
