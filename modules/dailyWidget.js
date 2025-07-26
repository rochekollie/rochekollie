export const dailyWidget =  {
    _date: new Date(),
  
    get date(){
      return this._date;
    },
  
    get monthNumber(){
      return this._date.getMonth() + 1;
    },
    
    get meridian() {
      return this._date.getHours() >= 12 ? 'PM' : 'AM';
    },
  
    get dateNumber() {
      return this._date.getDate();
    },
  
    get timeText(){
      return this._date.toLocaleTimeString();
    },
  
    get dateText(){
      return this._date.toLocaleDateString();
    },
  
    get shortDay(){
      return this._date.toLocaleString(undefined, {weekday: 'short'});
    },
  
    get longDay(){
      return this._date.toLocaleString(undefined, {weekday: 'long'});
    },
  
    get shortMonth(){
      return this._date.toLocaleString(undefined, {month: 'short'});
    },
  
    get longMonth(){
      return this._date.toLocaleString(undefined, {month: 'long'});
    },
  
    get shortYear(){
      return parseInt(this._date.toLocaleString(undefined, {year: '2-digit'}));
    },
  
    get longYear(){
      return this._date.getFullYear();
    },
  
    get shortDateText(){
      return this._date.toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'});
    },
  
    get longDateText(){
      return this._date.toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'});
    },
  
    get shortTimeText(){
      return this._date.toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric'});
    },
  
    get longTimeText(){
      return this._date.toLocaleTimeString(undefined, {hour: 'numeric', minute: 'numeric', second: 'numeric'});
    }
  };