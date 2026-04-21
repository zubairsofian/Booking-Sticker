import { useState, useEffect } from 'react';
import { Plus, Minus, CreditCard, User, ShoppingBag, CheckCircle, Database, Check, RefreshCw, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  nama: string;
  kuantitiKereta: number;
  kuantitiMotor: number;
  jumlahKeseluruhan: number;
  tarikh: string;
  dahBayar: boolean;
}

// ==========================================
// 1. TETAPAN URL GOOGLE APPS SCRIPT
// ==========================================
// Gantikan dengan URL Web App anda selepas deploy di Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxDaGp-FH8qEE1yTE5vnfUtUR23mmMa-kuAIhEuTuwjn5Jnd7moUGQ6W5gryno79lGM/exec';

const HARGA_KERETA = 5;
const HARGA_MOTOR = 5;

const AnimatedCar = ({ size = 24, strokeWidth = 2, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 10h2" className="animate-pulse" />
    <path d="M0 14h4" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
    <path d="M9 17h6"/>
    <circle cx="7" cy="17" r="2" strokeDasharray="3 3" className="animate-spin" style={{ transformOrigin: '7px 17px', animationDuration: '1s' }}/>
    <circle cx="17" cy="17" r="2" strokeDasharray="3 3" className="animate-spin" style={{ transformOrigin: '17px 17px', animationDuration: '1s' }}/>
  </svg>
);

const AnimatedMotor = ({ size = 24, strokeWidth = 2, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 11h2" className="animate-pulse" />
    <path d="M0 15h3" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/>
    <circle cx="5.5" cy="17.5" r="3.5" strokeDasharray="4 4" className="animate-spin" style={{ transformOrigin: '5.5px 17.5px', animationDuration: '1s' }} />
    <circle cx="18.5" cy="17.5" r="3.5" strokeDasharray="4 4" className="animate-spin" style={{ transformOrigin: '18.5px 17.5px', animationDuration: '1s' }} />
  </svg>
);

// ==========================================
// APLIKASI CUSTOMER (TEMPAHAN)
// ==========================================
function CustomerApp() {
  const [nama, setNama] = useState('');
  const [kuantitiKereta, setKuantitiKereta] = useState(0);
  const [kuantitiMotor, setKuantitiMotor] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalKereta = kuantitiKereta * HARGA_KERETA;
  const totalMotor = kuantitiMotor * HARGA_MOTOR;
  const jumlahKeseluruhan = totalKereta + totalMotor;

  const handleSahkan = async () => {
    if (jumlahKeseluruhan > 0 && nama.trim() !== '') {
      setIsSubmitting(true);
      
      const newOrder: Order = {
        id: Date.now().toString(),
        nama,
        kuantitiKereta,
        kuantitiMotor,
        jumlahKeseluruhan,
        tarikh: new Date().toLocaleString('ms-MY'),
        dahBayar: false
      };

      try {
        // Hantar data ke Google Apps Script (Sheet)
        await fetch(`${SCRIPT_URL}?action=create`, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(newOrder)
        });
        setIsSuccess(true);
      } catch (error) {
        console.error("Gagal hantar pesanan", error);
        // Teruskan juga ke ruangan kejayaan jika ralat network (anda boleh ubah suai jika mahu halang pelanggan)
        alert("Ralat semasa menyambung ke server. Kod akan cuba disambung selepas URL dimasukkan.");
        setIsSuccess(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDownloadQR = async () => {
    const imageUrl = "https://i.postimg.cc/mDD8tMHt/IMG-20260211-WA0004(1).jpg";
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Gagal");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = "QR_CIMB_AhmadZubair.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(imageUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setNama('');
    setKuantitiKereta(0);
    setKuantitiMotor(0);
  };

  if (isSuccess) {
    return (
      <div className="p-4 md:p-8 min-h-screen flex flex-col items-center justify-center bg-[#F7F7F7]">
        <div className="max-w-[600px] w-full bg-white p-6 sm:p-8 md:p-12 brutalist-border flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">Sila Buat Pembayaran</h1>
          <p className="text-sm sm:text-base md:text-lg font-bold uppercase mb-6 leading-relaxed md:leading-normal">
            Terima kasih, <span className="bg-yellow-300 px-2">{nama}</span><br />
            Sila imbas kod QR di bawah untuk pembayaran sebanyak <span className="underline decoration-4">RM {jumlahKeseluruhan.toFixed(2)}</span>.
          </p>
          
          <div className="border-4 border-black p-2 mb-3 w-full max-w-[280px]">
            <img 
              src="https://i.postimg.cc/mDD8tMHt/IMG-20260211-WA0004(1).jpg" 
              alt="QR Code Pembayaran CIMB DuitNow - Ahmad Zubair" 
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-xs font-bold opacity-60 mb-8 uppercase px-2">Tekan butang atau tahan pada gambar untuk simpan.</p>

          <div className="flex flex-col gap-4 w-full">
            <button 
               onClick={handleDownloadQR}
               className="w-full bg-yellow-400 text-black py-4 md:py-6 text-lg md:text-2xl font-black uppercase tracking-widest hover:bg-yellow-500 transition-colors neo-shadow border-4 border-black box-border cursor-pointer active:translate-y-1 active:translate-x-1 active:shadow-none"
            >
               Simpan / Buka QR
            </button>

            <button 
               onClick={handleReset}
               className="w-full bg-black text-white py-4 md:py-6 text-lg md:text-2xl font-black uppercase tracking-widest hover:bg-zinc-900 transition-colors neo-shadow box-border border-4 border-transparent"
            >
               Selesai & Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[#F7F7F7]">
      <div className="max-w-[960px] mx-auto min-h-[calc(100vh-4rem)] flex flex-col">
        <header className="mb-8 md:mb-10 flex flex-col gap-3 justify-between md:items-start border-b-4 border-black pb-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black italic tracking-tighter uppercase leading-none break-words">BOOKING STICKER</h1>
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest bg-yellow-300 px-3 py-1.5 w-fit border-2 border-black">SK SELAYANG BARU (2)</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 flex-1">
          <div className="md:col-span-7 flex flex-col gap-8">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-2 opacity-50">01. Maklumat Pelanggan</label>
              <input 
                type="text" 
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="MASUKKAN NAMA ANDA..." 
                className="w-full bg-transparent border-b-4 border-black py-3 md:py-4 text-xl sm:text-2xl md:text-4xl font-black placeholder:text-gray-300 uppercase"
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-black uppercase tracking-widest mb-6 opacity-50">02. Pilih Kuantiti Sticker</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Sticker Kereta */}
                <div className="bg-white p-6 brutalist-border flex flex-col items-center gap-4">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                    <AnimatedCar size={48} strokeWidth={2} color="black" />
                  </div>
                  <h3 className="text-xl font-black uppercase">KERETA</h3>
                  <div className="flex items-center gap-4 bg-black p-1 text-white w-full justify-center">
                    <button 
                      onClick={() => setKuantitiKereta(Math.max(0, kuantitiKereta - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 font-black text-2xl border-none disabled:opacity-50 cursor-pointer"
                      disabled={kuantitiKereta === 0}
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-2xl font-black">
                      {kuantitiKereta.toString().padStart(2, '0')}
                    </span>
                    <button 
                      onClick={() => setKuantitiKereta(kuantitiKereta + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 font-black text-2xl border-none cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs font-bold opacity-60">RM {HARGA_KERETA.toFixed(2)} / PCS</p>
                </div>

                {/* Sticker Motor */}
                <div className="bg-white p-6 brutalist-border flex flex-col items-center gap-4">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                    <AnimatedMotor size={48} strokeWidth={2} color="black" />
                  </div>
                  <h3 className="text-xl font-black uppercase">Motosikal</h3>
                  <div className="flex items-center gap-4 bg-black p-1 text-white w-full justify-center">
                    <button 
                      onClick={() => setKuantitiMotor(Math.max(0, kuantitiMotor - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 font-black text-2xl border-none disabled:opacity-50 cursor-pointer"
                      disabled={kuantitiMotor === 0}
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-2xl font-black">
                      {kuantitiMotor.toString().padStart(2, '0')}
                    </span>
                    <button 
                      onClick={() => setKuantitiMotor(kuantitiMotor + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 font-black text-2xl border-none cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs font-bold opacity-60">RM {HARGA_MOTOR.toFixed(2)} / PCS</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 pb-8 md:pb-0">
            <div className="bg-yellow-400 p-8 h-full brutalist-border flex flex-col">
              <h2 className="text-3xl font-black uppercase mb-8 border-b-2 border-black pb-4">Rumusan</h2>
              
              <div className="flex-1 flex flex-col gap-4">
                {kuantitiKereta > 0 && (
                  <div className="flex justify-between font-bold text-lg">
                    <span>CAR STICKER (x{kuantitiKereta})</span>
                    <span>RM {totalKereta.toFixed(2)}</span>
                  </div>
                )}
                {kuantitiMotor > 0 && (
                  <div className="flex justify-between font-bold text-lg">
                    <span>BIKE STICKER (x{kuantitiMotor})</span>
                    <span>RM {totalMotor.toFixed(2)}</span>
                  </div>
                )}
                
                {kuantitiKereta === 0 && kuantitiMotor === 0 && (
                   <div className="text-sm font-bold opacity-50 uppercase text-center mt-4">
                     Pilih sticker untuk melihat rumusan
                   </div>
                )}

                <div className="mt-auto pt-4 border-t-4 border-black">
                  <div className="flex justify-between items-end">
                     <span className="text-sm font-black uppercase">Jumlah Bayaran</span>
                     <span className="text-4xl lg:text-5xl font-black whitespace-nowrap">RM {jumlahKeseluruhan.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSahkan}
                disabled={jumlahKeseluruhan === 0 || !nama.trim() || isSubmitting}
                className="mt-8 w-full bg-black text-white py-5 sm:py-6 text-xl md:text-2xl font-black uppercase tracking-widest hover:bg-zinc-900 transition-colors neo-shadow disabled:opacity-50 disabled:shadow-none disabled:hover:bg-black disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? 'Menyimpan...' : 'Bayar Sekarang'}
              </button>
              <p className="mt-5 text-center text-sm md:text-base font-bold uppercase tracking-tighter opacity-80 text-black">
                Terima Kasih.
              </p>
            </div>
          </div>
        </div>
        
        {/* Link ke Admin Panel boleh diakses di laluan belakang tabir */}
      </div>
    </div>
  );
}

// ==========================================
// APLIKASI ADMIN (DASHBOARD)
// ==========================================
function AdminApp() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${SCRIPT_URL}?action=read`);
      if (!response.ok) throw new Error("Gagal mengambil data dari Google Sheets");
      const data = await response.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Ralat muat turun data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const togglePaymentStatus = async (orderId: string, currentStatus: boolean) => {
    // Kemaskini di UI (Optimistic update)
    const newStatus = !currentStatus;
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, dahBayar: newStatus } : order
    ));

    // Kemaskini di database (Sheets)
    try {
      await fetch(`${SCRIPT_URL}?action=update`, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
          id: orderId,
          dahBayar: newStatus
        })
      });
    } catch (error) {
       console.error("Gagal mengemaskini status", error);
       // Revert semula jika ralat
       setOrders(orders.map(order => 
         order.id === orderId ? { ...order, dahBayar: currentStatus } : order
       ));
       alert("Gagal mengemaskini status bayaran di server.");
    }
  };

  const totalDikutip = orders.filter(o => o.dahBayar).reduce((sum, o) => sum + (o.jumlahKeseluruhan || 0), 0);
  const totalSticker = orders.reduce((sum, o) => sum + (o.kuantitiKereta || 0) + (o.kuantitiMotor || 0), 0);

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-4 md:p-8 font-sans flex flex-col items-center">
      <div className="w-full max-w-[960px] bg-white brutalist-border p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-4 border-black pb-4 gap-4">
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">Admin Dashboard</h1>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={fetchOrders}
              className="flex items-center gap-2 border-4 border-black bg-white text-black px-4 py-2 font-bold hover:bg-gray-100 transition-colors uppercase tracking-widest text-sm flex-1 md:flex-none justify-center cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <a 
              href="/"
              className="bg-black text-white px-4 py-2 font-bold hover:bg-zinc-800 transition-colors uppercase tracking-widest text-sm flex-1 md:flex-none text-center cursor-pointer"
            >
              Tutup Admin
            </a>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-4 border-red-500 p-4 mb-8 font-bold text-red-700 flex items-center gap-3">
             <AlertCircle size={24} />
             {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-yellow-400 p-6 brutalist-border flex flex-col justify-center">
            <span className="text-sm font-black uppercase opacity-60">Jumlah Tempahan</span>
            <span className="text-5xl font-black">{orders.length}</span>
          </div>
          <div className="bg-blue-300 p-6 brutalist-border flex flex-col justify-center">
            <span className="text-sm font-black uppercase opacity-60">Jumlah Sticker Terjual</span>
            <span className="text-5xl font-black">{totalSticker}</span>
          </div>
          <div className="bg-green-400 p-6 brutalist-border flex flex-col justify-center">
            <span className="text-sm font-black uppercase opacity-60">Kutipan Disahkan</span>
            <span className="text-4xl lg:text-5xl font-black">RM {totalDikutip}</span>
          </div>
        </div>

        <div className="overflow-x-auto border-4 border-black">
          <table className="w-full text-left font-bold min-w-[700px]">
            <thead className="bg-black text-white uppercase tracking-widest text-sm border-b-4 border-black">
              <tr>
                <th className="p-4">Tarikh & Masa</th>
                <th className="p-4">Nama Pelanggan</th>
                <th className="p-4 text-center">Kereta</th>
                <th className="p-4 text-center">Motor</th>
                <th className="p-4 text-center whitespace-nowrap">Bil (RM)</th>
                <th className="p-4 text-center whitespace-nowrap">Status Bayaran</th>
              </tr>
            </thead>
            <tbody className="text-sm sm:text-base divide-y-2 divide-black">
              {loading && orders.length === 0 ? (
                <tr><td colSpan={6} className="p-10 text-center opacity-50 uppercase">Loading Data...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="p-10 text-center opacity-50 uppercase">Tiada Tempahan Direkodkan</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-xs tabular-nums text-gray-500 whitespace-nowrap">{order.tarikh}</td>
                    <td className="p-4 uppercase">{order.nama}</td>
                    <td className="p-4 text-center tabular-nums">{order.kuantitiKereta}</td>
                    <td className="p-4 text-center tabular-nums">{order.kuantitiMotor}</td>
                    <td className="p-4 text-center tabular-nums whitespace-nowrap">RM {order.jumlahKeseluruhan}</td>
                    <td className="p-4 text-center w-40">
                      <button 
                        onClick={() => togglePaymentStatus(order.id, order.dahBayar)}
                        className={`flex items-center justify-center gap-2 mx-auto w-full py-2 border-2 border-black font-black uppercase text-xs transition-colors cursor-pointer active:translate-y-px ${
                          order.dahBayar 
                          ? 'bg-green-400 hover:bg-green-500 text-black' 
                          : 'bg-red-400 hover:bg-red-500 text-white'
                        }`}
                      >
                        {order.dahBayar ? <><Check size={16} strokeWidth={3}/> Selesai</> : 'Belum'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ROUTING SEDERHANA (APP LAUNCHER)
// ==========================================
export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    
    // Custom wrapper to catch pushState changes
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  if (currentPath === '/admin') {
    return <AdminApp />;
  }
  
  return <CustomerApp />;
}
