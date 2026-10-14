export const BIRTHDAY = { year: 1987, month: 7, day: 11 };

export function getAge(today: Date = new Date()): number {
  const month = today.getMonth() + 1;
  const hadBirthday = month > BIRTHDAY.month || (month === BIRTHDAY.month && today.getDate() >= BIRTHDAY.day);
  return today.getFullYear() - BIRTHDAY.year - (hadBirthday ? 0 : 1);
}

export function splitList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');
}

export function slugify(title: string): string {
  return title.replace(/[\s.]/g, '-').toLowerCase();
}
