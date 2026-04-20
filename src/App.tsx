import { useState } from 'react';
import { Car, Bike, Plus, Minus, CreditCard, User, ShoppingBag, CheckCircle } from 'lucide-react';

const HARGA_KERETA = 5;
const HARGA_MOTOR = 5;

export default function App() {
  const [nama, setNama] = useState('');
  const [kuantitiKereta, setKuantitiKereta] = useState(0);
  const [kuantitiMotor, setKuantitiMotor] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalKereta = kuantitiKereta * HARGA_KERETA;
  const totalMotor = kuantitiMotor * HARGA_MOTOR;
  const jumlahKeseluruhan = totalKereta + totalMotor;

  const handleSahkan = () => {
    if (jumlahKeseluruhan > 0 && nama.trim() !== '') {
      setIsSuccess(true);
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
      <div className="p-4 md:p-8 min-h-screen flex flex-col items-center justify-center">
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
    <div className="p-4 md:p-8">
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
                    <Car size={48} strokeWidth={2} color="black" />
                  </div>
                  <h3 className="text-xl font-black uppercase">KERETA</h3>
                  <div className="flex items-center gap-4 bg-black p-1 text-white w-full justify-center">
                    <button 
                      onClick={() => setKuantitiKereta(Math.max(0, kuantitiKereta - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 font-black text-2xl border-none disabled:opacity-50"
                      disabled={kuantitiKereta === 0}
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-2xl font-black">
                      {kuantitiKereta.toString().padStart(2, '0')}
                    </span>
                    <button 
                      onClick={() => setKuantitiKereta(kuantitiKereta + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 font-black text-2xl border-none"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs font-bold opacity-60">RM {HARGA_KERETA.toFixed(2)} / PCS</p>
                </div>

                {/* Sticker Motor */}
                <div className="bg-white p-6 brutalist-border flex flex-col items-center gap-4">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                    <Bike size={48} strokeWidth={2} color="black" />
                  </div>
                  <h3 className="text-xl font-black uppercase">Motosikal</h3>
                  <div className="flex items-center gap-4 bg-black p-1 text-white w-full justify-center">
                    <button 
                      onClick={() => setKuantitiMotor(Math.max(0, kuantitiMotor - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 font-black text-2xl border-none disabled:opacity-50"
                      disabled={kuantitiMotor === 0}
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-2xl font-black">
                      {kuantitiMotor.toString().padStart(2, '0')}
                    </span>
                    <button 
                      onClick={() => setKuantitiMotor(kuantitiMotor + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-zinc-800 font-black text-2xl border-none"
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
                disabled={jumlahKeseluruhan === 0 || !nama.trim()}
                className="mt-8 w-full bg-black text-white py-5 sm:py-6 text-xl md:text-2xl font-black uppercase tracking-widest hover:bg-zinc-900 transition-colors neo-shadow disabled:opacity-50 disabled:shadow-none disabled:hover:bg-black disabled:cursor-not-allowed"
              >
                Bayar Sekarang
              </button>
              <p className="mt-5 text-center text-sm md:text-base font-bold uppercase tracking-tighter opacity-80 text-black">
                Terima Kasih.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
