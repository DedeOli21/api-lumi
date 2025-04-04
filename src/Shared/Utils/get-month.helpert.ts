export function getMonthName(month: string): string {
    const monthMap: { [key: string]: string } = {
        '01': 'JAN',
        '02': 'FEV',
        '03': 'MAR',
        '04': 'ABR',
        '05': 'MAI',
        '06': 'JUN',
        '07': 'JUL',
        '08': 'AGO',
        '09': 'SET',
        '10': 'OUT',
        '11': 'NOV',
        '12': 'DEZ',
      };
      month = monthMap[month] || month;

      return month;
}
