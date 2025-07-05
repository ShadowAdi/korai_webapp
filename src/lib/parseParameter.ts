export function parseParameters(text: string) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const result: {
    name: string;
    value: number;
    unit: string;
    normalMin?: number;
    normalMax?: number;
  }[] = [];

  const regex = /^([\w\s\(\)\-]+)\s+([\d.]+)\s+(\w+\/?\w*)\s+([\d.–<>\-]+)?$/;

  for (const line of lines) {
    const match = line.match(regex);
    if (match) {
      const [, name, valueStr, unit, range] = match;
      let normalMin, normalMax;
      if (range) {
        const nums = range.match(/[\d.]+/g)?.map(Number) ?? [];
        if (nums.length === 2) {
          [normalMin, normalMax] = nums;
        } else if (range.includes("<")) {
          normalMax = nums[0];
        } else if (range.includes(">")) {
          normalMin = nums[0];
        }
      }
      result.push({
        name: name.trim(),
        value: parseFloat(valueStr),
        unit,
        normalMin,
        normalMax,
      });
    }
  }
  return result;
}
