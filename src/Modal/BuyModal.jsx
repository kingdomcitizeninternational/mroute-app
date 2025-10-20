import React, { useState } from "react";
import styles from "./BuyModal.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { idbGet } from "../store/action/appStorage";


const BuyModal = () => {
  let { user, seedphrase, chain, network, address } = useSelector(state => state.userAuth)
  const [isAuthError, setIsAuthError] = useState(false)
  const [authInfo, setAuthInfo] = useState(false)

  let navigate = useNavigate()

  const location = useLocation();

  const navigateToPortfolio = () => {
    if (location.pathname === "/portfolio") {
      navigate("/settings");
    } else {
      navigate("/portfolio");
    }
  };



  const navigateSell = async() => {
    if (!user.walletFeauture) {
      setIsAuthError(true)
      setAuthInfo('Wallet feature is not enabled yet on this account')
      return
    }

    let seedphrase = await idbGet('seedphrase');
    if (!seedphrase) {
      return navigate('/create-wallet', { state: { email: user.email } })
    } else {
      if (seedphrase && chain && network && address) {
        navigate('/sell-assets')
      } else {
        return navigate('/import-wallet', { state: { email: user.email, seedphrase: seedphrase } })
      }
    }
  }


  const navigateBuy = async () => {
    if (!user.walletFeauture) {
      setIsAuthError(true)
      setAuthInfo('Wallet feature is not enabled yet on this account')
      return
    }

    let seedphrase = await idbGet('seedphrase');
    if (!seedphrase) {
      return navigate('/create-wallet', { state: { email: user.email } })
    } else {
      if (seedphrase && chain && network && address) {
        navigate('/buy-assets')
      } else {
        return navigate('/import-wallet', { state: { email: user.email, seedphrase: seedphrase } })
      }
    }
  }





  return (
    <>
      {!isAuthError ? <div className={styles.modalBackground}>
        <div className={styles.modalView}>
          <p className={styles.modalState}>Buy and Sell crypto on mroute</p>
          <div className={styles.modalButtonContainer}>
            <button className={styles.acceptBtn} onClick={navigateSell} >
              sell
            </button>
            <button className={styles.acceptBtn} onClick={navigateBuy}>
              buy
            </button>
          </div>
        </div>
      </div> : <div className={styles.modalBackground}>
        <div className={styles.modalView}>
          <p className={styles.modalState}>{authInfo}</p>
          <div className={styles.modalButtonContainer}>
            <button className={styles.acceptBtn} onClick={navigateToPortfolio}>
              Got it!
            </button>
          </div>
        </div>
      </div>}
    </>
  );
};

export default BuyModal;