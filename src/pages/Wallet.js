
import React, {useState} from 'react';
import {ethers} from 'ethers';
import '../css/wallet.css'

const Wallet = () => {
    const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [userBalance, setUserBalance] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const connectWalletHandler = () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
			console.log('MetaMask Here!');

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
				getAccountBalance(result[0]);
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			alert('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
    }


    // update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		getAccountBalance(newAccount.toString());
	}

    const getAccountBalance = (account) => {
		window.ethereum.request({method: 'eth_getBalance', params: [account, 'latest']})
		.then(balance => {
			setUserBalance(ethers.utils.formatEther(balance));
		})
		.catch(error => {
			setErrorMessage(error.message);
		});
	};

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

  return (
    <>
    <div className='wallet' >
    <h4 className='pb-5' > Connection to MetaMask  </h4>
			<button className='navStyle' onClick={connectWalletHandler}>{connButtonText}</button>
			<div className='accountDisplay py-3'>
				<h3>Address: {defaultAccount}</h3>
			</div>
			<div className='balanceDisplay py-2'>
				<h3>Balance: {userBalance}</h3>
			</div>
			{errorMessage}
    </div>
      
    </>
  )
}

export default Wallet;