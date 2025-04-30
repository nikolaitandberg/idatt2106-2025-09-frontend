export class Time {
  public hours: number;
  public minutes: number;

  constructor(hoursOrDate: number | Date, minutes?: number) {
    if (typeof hoursOrDate === "number") {
      this.hours = hoursOrDate;
      this.minutes = minutes!;
    } else {
      this.hours = hoursOrDate.getUTCHours();
      this.minutes = hoursOrDate.getUTCMinutes();
    }
  }

  public toDate(): Date {
    const date = new Date(0);
    date.setUTCHours(this.hours, this.minutes, 0, 0);
    return date;
  }
}
