import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Trade-center.module.css';
import BuyModal from '../Modal/BuyModal';
import Sidebar from '../components/MobileSideBar';
import 'react-activity/dist/library.css';
import DesktopSideBar from '../components/DesktopSideBar';
import SendModal from '../Modal/SendModal';
import AuthModal from '../Modal/AuthModal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import BackHeader from '../components/BackHeader';
import { SpinnerModal } from '../Modal/SpinnerModal';
import { fetchTrade } from '../store/action/appStorage';
import { useDispatch, useSelector } from 'react-redux';
import { idbGet, idbRemove, idbSet } from '../store/action/appStorage';
import MultiCoinChart from './Chart';


const TradeCenter = () => {
    const [cryptoData, setCryptoData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openBuyModal, setOpenBuyModal] = useState(false);
    const [openSendModal, setOpenSendModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [isAuthError, setIsAuthError] = useState(false);
    const [authInfo, setAuthInfo] = useState('');
    const [trades, setTrades] = useState([]);
    let { user, seedphrase, chain, network, address } = useSelector(state => state.userAuth)
    const dispatch = useDispatch();



    const buttonRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 50, y: 50 });

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        const fetchCryptoData = async () => {
            try {
                const res = await fetch(
                    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false'
                );
                const data = await res.json();
                setCryptoData(data);
            } catch (error) {
                console.error('Error fetching crypto data:', error);
            }
        };

        fetchCryptoData();
    }, []);

    const asyncall = async () => {
        if (loading) return;
        try {
            setLoading(true);
            const res = await dispatch(fetchTrade(user));
            if (!res.bool) {
                setAuthInfo(res.message);
                setIsAuthError(true);
                setLoading(false);
                return;
            }
            setTrades(res.message);
            setLoading(false);
        } catch (err) {
            setAuthInfo(err.message);
            setIsAuthError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        asyncall();
    }, []);

    const currencies = [
        { symbol: 'BTCUSD', name: 'BTCUSD', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025', color: '#f7931a' },
        { symbol: 'ETHUSD', name: 'ETHUSD', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=025', color: '#627eea' },
        { symbol: 'EURUSD', name: 'EUR/USD', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg', color: '#1a1aff' },
        { symbol: 'GBPUSD', name: 'GBP/USD', icon: 'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg', color: '#ff4d4f' },
        { symbol: 'XAUUSD', name: 'GOLD', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=025', color: '#ff9900' },
    ];

    const Card = ({ symbol, name, icon }) => {
        const handleImageError = (e) => {
            // Set a fallback image if the icon fails to load
            e.target.src = 'https://via.placeholder.com/40'; // A simple placeholder image for fallback
        };

        return (
            <div
                className={styles.card}
                style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <div className={styles.cardHeader} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <img
                        src={icon}
                        alt={name}
                        className={styles.icon}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginRight: '12px',
                        }}
                        onError={handleImageError} // Set fallback image on error
                    />
                    <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '18px', fontWeight: '600', color: '#fff' }}>{name}</strong>
                        <span
                            style={{
                                display: 'block',
                                fontSize: '14px',
                                color: '#888',
                                marginTop: '4px',
                            }}
                        >
                            US Dollar
                        </span>
                    </div>
                </div>
                <div className={styles.priceSection}>
                    <div className={styles.priceChart} style={{ marginTop: '15px' }}>
                        <div
                            className="tradingview-widget-container"
                            style={{
                                height: '100px',
                                width: '100%',
                                borderRadius: '8px',
                                overflow: 'hidden',
                            }}
                        >
                           <div
  style={{
    width: '100%',
    height: '100%',
    backgroundColor: '#000', // black background
    borderRadius: '8px',
    overflow: 'hidden',
  }}
>
  <iframe
    title={symbol}
    src={`https://s.tradingview.com/embed-widget/mini-symbol-overview/?symbol=FX:${symbol}&locale=en`}
    style={{
      width: '100%',
      height: '100%',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: '#000', // helps in case iframe background shows through
    }}
    allowTransparency="false"
    scrolling="no"
  ></iframe>
</div>

                        </div>
                    </div>
                </div>
            </div>
        );
    };



    const updateAuthError = () => {
        setIsAuthError(false);
        setAuthInfo('');
    };

    const openBuyModalFun = () => setOpenBuyModal(true);
    const openSendModalFun = () => setOpenSendModal(true);
    const buyFunction = () => setOpenBuyModal(false);
    const sellFunction = () => setOpenBuyModal(false);
    const sendFunction = () => setOpenSendModal(false);
    const receiveFunction = () => setOpenSendModal(false);
    const navigateHandler = () => navigate(-1);

    const handleMouseDown = (e) => {
        setDragging(true);
        buttonRef.current.initialX = e.clientX - position.x;
        buttonRef.current.initialY = e.clientY - position.y;
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;
        const newX = e.clientX - buttonRef.current.initialX;
        const newY = e.clientY - buttonRef.current.initialY;
        setPosition({ x: newX, y: newY });
    };
    const handleMouseUp = () => setDragging(false);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);


    const navigateMobileHandler = async (url) => {

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

    };;



    return (
        <>
            {isAuthError && <AuthModal modalVisible={isAuthError} updateVisibility={updateAuthError} message={authInfo} />}
            {openBuyModal && <BuyModal buyFun={buyFunction} sellFun={sellFunction} />}
            {openSendModal && <SendModal sendFun={sendFunction} receiveFun={receiveFunction} />}

            <div className={styles.dashboard}>
                <div className={styles.leftSection}>
                    <DesktopSideBar isInvest={true} navigateMobileHandler={navigateMobileHandler} />
                </div>

                {sidebarOpen && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isInvest={true} />}

                <div className={styles.mainSection}>
                    <BackHeader
                        navigateHandler={navigateHandler}
                        openBuyModalFun={openBuyModalFun}
                        openSendModalFun={openSendModalFun}
                        title='Trade Center'
                    />

                    <div className={styles.tickerTape} style={{ margin: '0 10px' }}>
                        <div className={styles.tickerInner}>
                            {cryptoData.map((coin, index) => (
                                <div key={index} className={styles.tickerItem}>
                                    <img src={coin.image} alt={coin.name} className={styles.coinIcon} />
                                    <span className={styles.coinName}>{coin.symbol.toUpperCase()}</span>
                                    <span
                                        className={
                                            coin.price_change_percentage_24h >= 0
                                                ? styles.priceUp
                                                : styles.priceDown
                                        }
                                    >
                                        ${(coin?.current_price ?? 0).toFixed(2)} ({(coin?.price_change_percentage_24h ?? 0).toFixed(2)}%)

                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ marginTop: '50px' }}><SpinnerModal /></div>
                    ) : (
                        <>
                            <div className={styles.tradeSummaryCard}>
                                <button
                                    ref={buttonRef}
                                    onMouseDown={handleMouseDown}
                                    className={styles.ctaButton}
                                    style={{
                                        position: 'absolute',
                                        left: position.x,
                                        top: position.y,
                                        cursor: dragging ? 'grabbing' : 'grab',
                                        zIndex: 1000
                                    }}
                                >
                                    Create active trade
                                </button>

                                <div className={styles.tableWrapper}>
                                    <table
                                        className={styles.tradeTable}
                                        style={{
                                            width: '100%',
                                            borderCollapse: 'collapse',
                                            fontFamily: "'ABeeZee', sans-serif",
                                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        <thead>
                                            <tr style={{ backgroundColor: 'black', borderBottom: '2px solid #ddd' }}>

                                                <th
                                                    style={{
                                                        padding: '12px 15px',
                                                        textAlign: 'left',
                                                        fontSize: '18px', // Increased font size
                                                        fontWeight: '600',
                                                        color: '#fff',
                                                    }}
                                                >
                                                    ID
                                                </th>
                                                <th
                                                    style={{
                                                        padding: '12px 15px',
                                                        textAlign: 'left',
                                                        fontSize: '18px', // Increased font size
                                                        fontWeight: '600',
                                                        color: '#fff',
                                                    }}
                                                >
                                                    Date
                                                </th>
                                                <th
                                                    style={{
                                                        padding: '12px 15px',
                                                        textAlign: 'left',
                                                        fontSize: '18px', // Increased font size
                                                        fontWeight: '600',
                                                        color: '#fff',
                                                    }}
                                                >
                                                    Pair
                                                </th>
                                                <th
                                                    style={{
                                                        padding: '12px 15px',
                                                        textAlign: 'left',
                                                        fontSize: '18px', // Increased font size
                                                        fontWeight: '600',
                                                        color: '#fff',
                                                    }}
                                                >
                                                    Profit
                                                </th>
                                                <th
                                                    style={{
                                                        padding: '12px 15px',
                                                        textAlign: 'left',
                                                        fontSize: '18px', // Increased font size
                                                        fontWeight: '600',
                                                        color: '#fff',
                                                    }}
                                                >
                                                    Loss
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trades.map((data, index) => (
                                                <tr
                                                    key={index}
                                                    style={{
                                                        borderBottom: '1px solid #f1f1f1',
                                                        backgroundColor: index % 2 === 0 ? 'black' : 'black',
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: '15px 20px', // Increased padding
                                                            fontSize: '16px', // Increased font size
                                                            textAlign: 'left',
                                                            color: '#fff',
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '15px 20px', // Increased padding
                                                            fontSize: '16px', // Increased font size
                                                            textAlign: 'left',
                                                            color: '#fff',
                                                        }}
                                                    >
                                                        {data.date}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '15px 20px', // Increased padding
                                                            fontSize: '16px', // Increased font size
                                                            textAlign: 'left',
                                                            color: '#fff',
                                                        }}
                                                    >
                                                        {data.pair}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '15px 20px', // Increased padding
                                                            fontSize: '16px', // Increased font size
                                                            fontWeight: 'bold',
                                                            color: '#10B981',
                                                            textAlign: 'left',
                                                        }}
                                                    >
                                                        {user.currency || '$'}{data.profit}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: '15px 20px', // Increased padding
                                                            fontSize: '16px', // Increased font size
                                                            fontWeight: 'bold',
                                                            color: '#EF4444',
                                                            textAlign: 'left',
                                                        }}
                                                    >
                                                        {user.currency || '$'}{data.loss}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>




                                {trades.length === 0 && (
                                    <div className={styles.historyCard}>
                                        <h3 className={styles.sectionTitle}>My Trades</h3>
                                        <p className={styles.emptyText}>No Trade found.</p>
                                    </div>
                                )}
                            </div>

                            <div className={styles.dashboardWrapper}>
                                <div className={styles.scrollingWrapper}>
                                    {currencies.map((currency) => (
                                        <Card key={currency.symbol} {...currency} />
                                    ))}
                                </div>
                            </div>

                               <div className={styles.cardContainer}>
                        <MultiCoinChart />
                        </div>
                        
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default TradeCenter;
