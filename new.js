/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TASK 1 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

const tickerContainer = document.getElementById('ticker-container');

const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=uponly-token,bitcoin,ethereum,solana,polkadot,arbitrum,alphascan,oasis-network,nakamoto-games,chainlink,tribeone,hmx,prosper,airtor-protocol,blocktools,RocketX,blocktools,mevfree,carbon-browser,curve-dao-token,0x0-ai-ai-smart-contract,smardex,vulcan-forged,aave,uniswap,1inch,allianceblock-nexera,voxies';

let animationTimeout;
let animationDuration = 30000;
let isTickerPaused = false;

async function fetchTickerData() {
   try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const tickerItems = data.map(item => createTickerItem(item));
      tickerContainer.innerHTML = tickerItems.join('');
   } catch (error) {
      console.error('Error fetching ticker data:', error);
   }
}

function createTickerItem(item) {
   const {
      image,
      symbol,
      current_price,
      price_change_percentage_24h,
      id
   } = item;
   const priceChangeClass = price_change_percentage_24h > 0 ? 'positive' : 'negative';

   return `
    <div class="ticker-item">
      <a href="https://www.coingecko.com/en/coins/${id}" target="_blank">
        <img src="${image}" alt="${symbol} logo" class="ticker-logo">
        <span class="ticker-symbol">${symbol.toUpperCase()}</span>
        <span class="ticker-price">$${current_price.toFixed(4)}</span>
        <span class="ticker-change ${priceChangeClass}">${price_change_percentage_24h.toFixed(2)}%</span>
      </a>
    </div>
  `;
}

function startTickerAnimation() {
   clearTimeout(animationTimeout);
   tickerContainer.style.animation = 'none';
   tickerContainer.offsetHeight; // Trigger reflow to restart the animation
   tickerContainer.style.animation = `tickerAnimation ${animationDuration / 750}s linear infinite`;
   animationTimeout = setTimeout(startTickerAnimation, animationDuration * 5);
}

function pauseTickerAnimation() {
   tickerContainer.style.animationPlayState = 'paused';
   isTickerPaused = true;
}

function resumeTickerAnimation() {
   tickerContainer.style.animationPlayState = 'running';
   isTickerPaused = false;
}

fetchTickerData();
startTickerAnimation();

tickerContainer.addEventListener('mouseenter', pauseTickerAnimation);
tickerContainer.addEventListener('mouseleave', resumeTickerAnimation);

/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TASK 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/


async function sendTransaction() {
   const web3 = new Web3(window.ethereum);
   const recipient = document.getElementById('recipient').value;
   const messageInput = document.getElementById('message');
   const message = messageInput.value;
   const signature = ' - Kuma Bartholomew';
   const combinedMessage = message + signature;
   const hexData = web3.utils.asciiToHex(combinedMessage);

   try {
      const accounts = await ethereum.request({
         method: 'eth_accounts'
      });

      // Check if a wallet is connected
      if (accounts.length === 0) {
         await ethereum.request({
            method: 'eth_requestAccounts'
         });
      }

      const address = accounts[0];

      const transactionParameters = {
         from: address,
         to: recipient,
         value: web3.utils.toWei('0.0000001', 'ether'),
         data: hexData,
      };

      const result = await ethereum.request({
         method: 'eth_sendTransaction',
         params: [transactionParameters],
      });

      console.log('Transaction sent:', result);
   } catch (error) {
      console.error(error);
   }
}

function toggleTheme() {
   const body = document.querySelector('body');

   if (body.classList.contains('dark-mode')) {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');

      document.querySelector('.toggle-button img').src = 'light_mode.png';
   } else {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      document.querySelector('.toggle-button img').src = 'dark_mode.png';
   }
}

/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< TASK 3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

const tokenList = [];
const apiKey = 'DM7QQP89VWQQ2BSXNE948XMR6DAXNKNDE9';

let web3;
let userWallet;
let isConnected = false;
let isDataFetched = false;

async function connectWallet() {
   if (isConnected) {
      return;
   }

   if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this dApp!');
      return;
   }

   await window.ethereum.request({
      method: 'eth_requestAccounts'
   });

   web3 = new Web3(window.ethereum);
   userWallet = await web3.eth.getAccounts().then(accounts => accounts[0]);

   document.getElementById('userWallet').value = userWallet;

   console.log('Connected to wallet:', userWallet);

   isConnected = true;

   if (!isDataFetched) {
      fetchDataAndGenerateTable();
      isDataFetched = true;
   }
}

let today = new Date();

let dateOptions = {
   year: 'numeric',
   month: 'long',
   day: 'numeric'
};

let formattedDate = today.toLocaleDateString('en-US', dateOptions);

document.getElementById('todayDate').value = formattedDate;

window.addEventListener('DOMContentLoaded', () => {
   const connectButton = document.getElementById('cnctBtn');
   connectButton.addEventListener('click', connectWallet);
});


async function getEthData() {
   try {
      const balanceUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${userWallet}&tag=latest&apikey=${apiKey}`;
      const balReponse = await fetch(balanceUrl);
      const balData = await balReponse.json();
      const ethUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum';
      if (balData.status == '1') {
         let balance = Number(balData.result) / 10 ** 18;

         const ethResponse = await fetch(ethUrl);
         const ethData = await ethResponse.json();

         if (ethData) {
            const name = ethData[0]["name"];
            const symbol = ethData[0]["symbol"];
            const logo = ethData[0]["image"];
            const currentPrice = ethData[0]["current_price"];
            const marketCap = ethData[0]["market_cap"];
            const priceChange = ethData[0]["price_change_percentage_24h"];
            const usdBalance = currentPrice * balance;

            const ethInfo = {
               name: name,
               symbol: symbol,
               logo: logo,
               balance: balance,
               current_price: currentPrice,
               market_cap: marketCap,
               price_change: priceChange,
               usd_balance: usdBalance,
            };
            tokenList.push(ethInfo);
         }
      }
   } catch (error) {
      console.error('An error occurred while fetching Ethereum data:', error);
   }
}

async function getTokenData() {
   try {
      const tokenAddress = '0xc14B4d4CA66f40F352d7a50fd230EF8b2Fb3b8d4';
      const tokenethUrl = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${userWallet}&tag=latest&apikey=${apiKey}`;
      const balResponse = await fetch(tokenethUrl);
      const balData = await balResponse.json();

      if (balData.status == '1') {
         let balance = Number(balData.result) / 10 ** 18;

         const tokencgUrl = `https://api.coingecko.com/api/v3/coins/ethereum/contract/${tokenAddress}`;
         const tokenReponse = await fetch(tokencgUrl);
         const tokenData = await tokenReponse.json();

         if (tokenData) {
            const name = tokenData.name;
            const symbol = tokenData.symbol;
            const logo = tokenData.image.small;
            const balace = balance;
            const currentPrice = tokenData.market_data.current_price.usd;
            const marketCap = tokenData.market_data.fully_diluted_valuation.usd;
            const priceChange = tokenData.market_data.price_change_percentage_24h;
            const usdBalance = balance * currentPrice;

            const tokenInfo = {
               name: name,
               symbol: symbol,
               logo: logo,
               balance: balance,
               current_price: currentPrice,
               market_cap: marketCap,
               price_change: priceChange,
               usd_balance: usdBalance,
            };

            tokenList.push(tokenInfo);

            isDataFetched = true;
         }
      }
   } catch (error) {
      console.error('An error occurred while fetching token data:', error);
   }
}

async function fetchData() {
   await Promise.all([getEthData(), getTokenData()]);
   console.log(tokenList);
}

async function fetchDataAndGenerateTable() {

   await fetchData();
   generateTokenTable();
}

fetchDataAndGenerateTable();


function generateTokenTable() {
   const tokenTableBody = document.getElementById("tokenTableBody");

   // Clear existing table rows
   tokenTableBody.innerHTML = "";

   // Generate table rows dynamically based on the token list
   tokenList.forEach((token, index) => {
      const row = document.createElement("tr");
      const logoCell = document.createElement("td");
      const nameCell = document.createElement("td");
      const symbolCell = document.createElement("td");
      const balanceCell = document.createElement("td");
      const currentPriceCell = document.createElement("td");
      const usdBalanceCell = document.createElement("td");
      const change24hCell = document.createElement("td");
      const marketCapCell = document.createElement("td");

      const logoButton = document.createElement("button");
      logoButton.addEventListener("click", () => displayTokenInfo(index + 1));
      const logoImage = document.createElement("img");
      logoImage.src = token.logo;
      logoImage.alt = `Logo ${index + 1}`;
      logoImage.classList.add('logo-style');
      logoButton.appendChild(logoImage);
      logoCell.appendChild(logoButton);

      nameCell.id = `nameCell${index + 1}`;
      symbolCell.id = `symbolCell${index + 1}`;
      balanceCell.id = `balanceCell${index + 1}`;
      currentPriceCell.id = `currentPriceCell${index + 1}`;
      usdBalanceCell.id = `usdBalanceCell${index + 1}`;
      change24hCell.id = `change24hCell${index + 1}`;
      marketCapCell.id = `marketCapCell${index + 1}`;

      row.appendChild(logoCell);
      row.appendChild(nameCell);
      row.appendChild(symbolCell);
      row.appendChild(balanceCell);
      row.appendChild(currentPriceCell);
      row.appendChild(usdBalanceCell);
      row.appendChild(change24hCell);
      row.appendChild(marketCapCell);

      tokenTableBody.appendChild(row);
   });
}

function displayTokenInfo(tokenNumber) {
   const nameCell = document.getElementById(`nameCell${tokenNumber}`);
   nameCell.classList.add('text-style');
   const symbolCell = document.getElementById(`symbolCell${tokenNumber}`);
   symbolCell.classList.add('text-style')
   const balanceCell = document.getElementById(`balanceCell${tokenNumber}`);
   const currentPriceCell = document.getElementById(`currentPriceCell${tokenNumber}`);
   const usdBalanceCell = document.getElementById(`usdBalanceCell${tokenNumber}`);
   const change24hCell = document.getElementById(`change24hCell${tokenNumber}`);
   const marketCapCell = document.getElementById(`marketCapCell${tokenNumber}`);

   // Retrieve the token information from the tokenList array
   const token = tokenList[tokenNumber - 1];

   if (token) {
      // Update the HTML cells with the token information
      nameCell.innerText = token.name.toUpperCase();
      symbolCell.innerText = token.symbol.toUpperCase();
      balanceCell.innerText = `${token.balance.toFixed(2)} ${token.symbol.toUpperCase()}`;
      currentPriceCell.innerText = `$${token.current_price.toFixed(2)}`;
      usdBalanceCell.innerText = `$${token.usd_balance.toFixed(2)}`;
      change24hCell.innerText = `${token.price_change.toFixed(2)}%`;
      marketCapCell.innerText = `$${Number(token.market_cap).toLocaleString()}`;

      // Do something with the logo button if needed
      console.log(`Clicked on logo button ${tokenNumber}`);
   }
}

// Generate the token table on page load
generateTokenTable();S