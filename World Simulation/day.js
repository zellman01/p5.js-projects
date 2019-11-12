class Day {
  constructor() {
    this.night = false;
  }
  
  state() {
    if (this.night)
      return "Night";
    else
      return "Day";
  }
  
  returnState() {
    return this.night;
  }
  
  changeState() {
    this.night = !this.night;
  }
}