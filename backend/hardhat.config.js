//https://eth-rinkeby.alchemyapi.io/v2/YNmrv5GbOwNXwUR5VD49HyZo0IGvT16y

require('@nomiclabs/hardhat-waffle')


module.exports = {
  solidity:'0.8.0',
  networks : {
    rinkeby:{
      url : 'https://eth-rinkeby.alchemyapi.io/v2/YNmrv5GbOwNXwUR5VD49HyZo0IGvT16y',
      accounts : ['c9dc28321e6fb2302ff80d9d1b67264f3aa9102453385074ddf972d4e59cd20d']
    }
  }
}