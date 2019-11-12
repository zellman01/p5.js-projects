class Resource {
  constructor(name, amount) {
    this.resourceName = name;
    this.resourceAmount = amount;
    this.gone = false;
    this.dayGone = 0;
  }
  
  name() {
    return this.resourceName;
  }
  
  amount() {
    return this.resourceAmount;
  }
  
  removed() {
    return this.gone;
  }
  
  dayRemoved() {
    return this.dayGone;
  }
  
  changeDayGone(a) {
    a = parseInt(a);
    this.dayGone = a;
  }
  
  changeAmount(a) {
    a = parseInt(a);
    if (!this.gone)
      this.resourceAmount += a;
    
    if (this.resourceAmount < 0) {
      this.resourceAmount = 0;
      this.gone = true;
    }
  }
}