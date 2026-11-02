const { getWeather } = require("./weather.tool");
const { getNews } = require("./news.tool");

const { convertCurrency } = require("./currency.tool");

// Inside executeTool(name, args), add:

async function executeTool(name, args) {
  switch (name) {
    case "get_weather":
      return await getWeather(args.city);

       case "get_news":
      return getNews(args.query);


      case "convert_currency":
  return convertCurrency(args.amount, args.from, args.to);

  
    default:
      throw new Error(`Tool not allowed: ${name}`);
  }
}

module.exports = { executeTool };