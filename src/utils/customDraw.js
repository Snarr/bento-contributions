import { themes } from '../utils/themes'

export const drawContributions = (canvas, {data, username, themeName, footerText, size, rows, columns, padding}) => {
  var curr = new Date;
  var first = curr.getDate() - curr.getDay();
  var last = first + 6;
  var lastday = new Date(curr.setDate(last))
  let date = daysIntoYear(lastday);
  let contributions = data.contributions;
  let max = Math.max(rows, columns)
  
  let lastXcontributions = contributions.slice(365-date, 365-date+(max*max));

  canvas.width = 1000;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = themes[themeName].background
  ctx.fillRect(0, 0, 1000, 1000);

  let gapC = (1000-(columns*size)-(2*padding))/(columns-1);
  let gapR = (1000-(rows*size)-(2*padding))/(rows-1);

  for (let c = columns-1; c >= 0; c--) {
    for (let r = rows-1; r >= 0; r--) {
      let realCount = rows*(rows-r-1) + (columns-c-1)
      ctx.fillStyle = themes[themeName][`grade${lastXcontributions[realCount].intensity}`]
      

      let posX = padding + gapR*r + size*r; // X position calculated based on 
      let posY = padding + gapC*c + size*c;

      // ctx.font = "75px"
      // ctx.fillText(realCount, posX, posY)
      ctx.beginPath();
      ctx.roundRect(posX, posY, size, size, 15);
      ctx.fill();
      ctx.closePath();
    }
  }
}

function drawXContributions(canvas, data, size, rows, columns, padding) {
  
}

function daysIntoYear(date){
  return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
}