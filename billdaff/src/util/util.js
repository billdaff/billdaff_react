
  export function getAge(){
    var currentDate = new Date();
    var birthday = new Date('1987-07-11');
    if (currentDate.getMonth() === birthday.getMonth()) {
      if (currentDate.getDay > birthday.getDay ){
        return currentDate.getFullYear() - birthday.getFullYear();
      }
    }
    else if (currentDate.getMonth() > birthday.getMonth()){
      return currentDate.getFullYear() - birthday.getFullYear();
    }
    return currentDate.getFullYear() - birthday.getFullYear() -1;

  };

  export function GetTechnologies(technologies) {
    var techStr = '';
    technologies.split(', ').map((techItem, key) => (
      techStr += `<li key=${key} ><a>'+ ${techItem} +'</a></li>`
    ))
    return (
      techStr
    )
  }
