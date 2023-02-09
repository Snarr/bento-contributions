
export const drawContributions = (ref, {data, username, themeName, footerText, rows, columns, padding}) => {
  let date = daysIntoYear(new Date());
  let contributions = data.contributions;
  let lastXcontributions = contributions.slice(365-date, 365-date+(rows*columns));
  drawXContributions(ref, lastXcontributions, rows, columns, padding);
}

function drawXContributions(canvas, data, rows, columns, padding) {
  canvas.width = 1000;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, 1000, 1000);

  const size = 100;
  let gapX = (1000-(columns*size)-(2*padding))/(columns-1);
  let gapY = (1000-(rows*size)-(2*padding))/(rows-1);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      ctx.fillStyle = data[rows*i + j].color

      let posX = padding + gapX*j + size*j;
      let posY = padding + gapY*i + size*i;

      ctx.beginPath();
      ctx.roundRect(posX, posY, size, size, 15);
      ctx.fill();
      ctx.closePath();
    }
  }
  // console.log(canvas.toDataURL())
}

function daysIntoYear(date){
  return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
}