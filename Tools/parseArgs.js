const yargs = require("yargs/yargs");

module.exports = () => {
  const arg = yargs(process.argv.slice(2)).argv._;
  switch (arg) {
    case 'rooms':
        return ['./Data/hosts-stockholm.csv', arg];
    case 'reviews':
        return ['./Data/reviews-stockholm.csv', arg];
    default:
        return ['./Data/hosts-stockholm.csv', 'rooms'];
    
  }
};
