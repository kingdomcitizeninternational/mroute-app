import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Profile.module.css';
import BuyModal from '../Modal/BuyModal';
import SendModal from '../Modal/SendModal';
import DesktopSideBar from '../components/DesktopSideBar';
import BackHeader from '../components/BackHeader';
import { useSelector } from 'react-redux';
import ProfileModal from '../Modal/ProfileModal';
import AuthModal from '../Modal/AuthModal';
import { FaUser } from 'react-icons/fa';
import { idbGet } from "../store/action/appStorage";

const Profile = () => {
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [propertyName, setPropertyName] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [isAuthError, setIsAuthError] = useState(false);
  const [authInfo, setAuthInfo] = useState('');
  const [imageError, setImageError] = useState(false);

  let { user, seedphrase, chain, network, address } = useSelector(state => state.userAuth)

  const navigate = useNavigate();

  const updateAuthError = () => {
    setIsAuthError(prev => !prev);
    setAuthInfo('');
  };

  const openBuyModalFun = () => setOpenBuyModal(true);
  const openSendModalFun = () => setOpenSendModal(true);
  const buyFunction = () => setOpenBuyModal(false);
  const sellFunction = () => setOpenBuyModal(false);
  const sendFunction = () => setOpenSendModal(false);
  const receiveFunction = () => setOpenSendModal(false);
  const navigateHandler = () => navigate(-1);

  const handleEditHandler = () => navigate('/registeration');

  const openModal = (propertyName, propertyValue) => {
    setOpenProfileModal(true);
    setPropertyName(propertyName);
    setPropertyValue(propertyValue);
  };

  const hideProfileModal = () => setOpenProfileModal(false);





  const navigateMobileHandler = async (url) => {

    try {
      if (url === 'dashboard') {
        if (!user.walletFeauture) {
          setIsAuthError(true)
          setAuthInfo('Wallet feature is not enabled yet on this account')
          return
        }
        //logic to check if wallet properties are saved to async storage
        let seedphrase = await idbGet('seedphrase');

        if (!seedphrase) {

          return navigate('/create-wallet', { state: { email: user.email } })
        } else {

          if (seedphrase && chain && network && address) {
            return navigate('/dashboard')
          } else {
            return navigate('/import-wallet', { state: { email: user.email, seedphrase: seedphrase } })
          }
        }
      } else if (url === 'transactions') {
        if (!user.walletFeauture) {
          setIsAuthError(true)
          setAuthInfo('Wallet feature is not enabled yet on this account')
          return
        }
        //logic to check if wallet properties are saved to async storage
        let seedphrase = await idbGet('seedphrase');
        if (!seedphrase) {
          return navigate('/create-wallet', { state: { email: user.email } })
        } else {
          if (seedphrase && chain && network && address) {
            return navigate('/transactions')
          } else {
            return navigate('/import-wallet', { state: { email: user.email, seedphrase: seedphrase } })
          }
        }
      } else {
        return navigate(`/${url}`)
      }
    } catch (err) {
      console.log(err)
    }
  };



  return (
    <>
      {isAuthError && <AuthModal modalVisible={isAuthError} updateVisibility={updateAuthError} message={authInfo} />}
      {openBuyModal && <BuyModal buyFun={buyFunction} sellFun={sellFunction} />}
      {openSendModal && <SendModal sendFun={sendFunction} receiveFun={receiveFunction} />}
      {openProfileModal && <ProfileModal hideModal={hideProfileModal} propertyName={propertyName} propertyValue={propertyValue} />}

      <div className={styles.dashboard}>
        <div className={styles.leftSection}>
          <DesktopSideBar navigateMobileHandler={navigateMobileHandler} />
        </div>

        <div className={styles.mainSection}>
          <BackHeader
            navigateHandler={navigateHandler}
            openBuyModalFun={openBuyModalFun}
            openSendModalFun={openSendModalFun}
            title='Profile'
          />

          <div className={styles.dashboardContent}>
            <div className={styles.dashboardContentleft}>
              <div className={styles.profileCard}>
                <div className={styles.profileTop}>
                  <div className={styles.avatarWrapper}>
                    {!imageError && user?.profilePhotoUrl ? (
                      <img
                        src={user.profilePhotoUrl}
                        alt="User Avatar"
                        className={styles.avatar}
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <FaUser className={styles.avatar} color="rgb(180,180,180)" size={40} />
                    )}
                  </div>
                  <div className={styles.userDetails}>
                    <h2 className={styles.name}>
                      {user?.firstName?.slice(0, 8)} {user?.lastName?.slice(0, 8)}
                    </h2>
                    <p className={styles.email}>{user?.email?.slice(0, 15)}...</p>
                  </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.detailsSection}>
                  {seedphrase && network && address && (
                    <>
                      <div className={styles.detailItem} onClick={() => openModal('Wallet Address', address)}>
                        <span className={styles.label}>Wallet Address</span>
                        <p className={styles.value}>{address?.slice(0, 10)}...</p>
                      </div>

                      <div className={styles.detailItem} onClick={() => openModal('Network', network)}>
                        <span className={styles.label}>Network</span>
                        <p className={styles.value}>{network}</p>
                      </div>
                    </>
                  )}

                  <div className={styles.detailItem} onClick={() => openModal('Passcode', user.passcode)}>
                    <span className={styles.label}>Passcode</span>
                    <p className={styles.value}>{user.passcode}</p>
                  </div>

                  <div className={styles.detailItem} onClick={() => openModal('NID', user.nid)}>
                    <span className={styles.label}>NID</span>
                    <p className={styles.value}>{user.nid}</p>
                  </div>

                  <div className={styles.detailItem} onClick={() => openModal('Country', user.country)}>
                    <span className={styles.label}>Country</span>
                    <p className={styles.value}>{user.country}</p>
                  </div>

                  <div className={styles.detailItem} onClick={() => openModal('State', user.state)}>
                    <span className={styles.label}>State</span>
                    <p className={styles.value}>{user.state}</p>
                  </div>

                  <div className={styles.detailItem} onClick={() => openModal('Address', user.address)}>
                    <span className={styles.label}>Address</span>
                    <p className={styles.value}>{user.address?.slice(0, 14)}...</p>
                  </div>
                </div>

                <div className={styles.buttonWrapper}>
                  <button className={styles.editProfileBtn} onClick={handleEditHandler}>
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.dashboardContentright}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
