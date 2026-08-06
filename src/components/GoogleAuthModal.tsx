import React, { useState } from 'react';
import { X, AlertCircle, RefreshCw, LogIn } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';
import { signInWithGoogle, signInWithGoogleRedirect, isFirebaseConfigured, GoogleUserProfile } from '../utils/firebase';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVotingClosed?: boolean;
  onLoginSuccess: (user: GoogleUserProfile) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  isVotingClosed = false,
  onLoginSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isInAppBrowser = () => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    return (
      ua.includes('FBAN') ||
      ua.includes('FBAV') ||
      ua.includes('Zalo') ||
      ua.includes('Instagram') ||
      ua.includes('Line')
    );
  };
  const isBlockedBrowser = isInAppBrowser();

  const handleQuickPopupLogin = async () => {
    soundFx.playSelect();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isFirebaseConfigured) {
        const userProfile = await signInWithGoogle();
        onLoginSuccess(userProfile);
        onClose();
      } else {
        setErrorMessage("Cấu hình Firebase chưa đủ trong .env.");
      }
    } catch (err: any) {
      console.error("Google Popup Auth error:", err);
      if (err?.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        setErrorMessage(`⚠️ Tên miền "${currentDomain}" chưa được ủy quyền trong Firebase! Vui lòng vào Firebase Console của project CŨ (hugo-choice-2026) ➔ Authentication ➔ Settings ➔ Authorized Domains ➔ Bấm Add domain ➔ Nhập "${currentDomain}".`);
      } else if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/popup-blocked' ||
        err?.code === 'auth/cancelled-popup-request'
      ) {
        setErrorMessage('⚠️ Cửa sổ Popup bị chặn hoặc tự đóng. Bạn hãy chọn nút "Đăng nhập bằng trang mới (Redirect)" bên dưới để đăng nhập chuẩn 100%!');
      } else if (err?.message) {
        setErrorMessage(`⚠️ Đăng nhập không thành công: ${err.message}`);
      } else {
        setErrorMessage('⚠️ Đăng nhập không thành công. Bạn có thể bấm nút Đăng nhập bằng trang mới bên dưới.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectLogin = async () => {
    soundFx.playSelect();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signInWithGoogleRedirect();
    } catch (err: any) {
      console.error("Google Redirect error:", err);
      if (err?.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        setErrorMessage(`⚠️ Tên miền "${currentDomain}" chưa được ủy quyền trong Firebase! Vui lòng vào Firebase Console của project CŨ (hugo-choice-2026) ➔ Authentication ➔ Settings ➔ Authorized Domains ➔ Bấm Add domain ➔ Nhập "${currentDomain}".`);
      } else {
        setErrorMessage(`⚠️ Đăng nhập chuyển trang thất bại: ${err?.message || 'Lỗi không xác định'}`);
      }
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    soundFx.playSelect();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Hugo Guest User',
        email: 'guest@hugoenglishclub.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HugoGuest'
      });
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar rounded-3xl">
        <div className="w-full bg-[#132217] border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Đóng modal (Chưa đăng nhập)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center pb-4 border-b border-white/10">
            <div className="inline-flex p-3 rounded-full bg-amber-400/20 border border-amber-400/50 mb-3">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
            </div>
            <h2 className="font-serif-display text-xl sm:text-2xl font-extrabold text-white tracking-wide">
              Đăng nhập Hugo Award
            </h2>
            <p className="font-sans-clean text-xs text-amber-200/90 mt-1">
              Đăng nhập tài khoản Google để xác thực phiếu bầu chính thức
            </p>
          </div>

          {/* Voting Closed Banner */}
          {isVotingClosed && (
            <div className="mt-4 p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs flex items-start space-x-2.5 shadow-inner">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed font-semibold">
                ⚠️ Cổng bình chọn đã đóng! Chỉ tài khoản Ban tổ chức (Admin) mới có thể đăng nhập lúc này để mở lại hoặc xem số liệu.
              </div>
            </div>
          )}

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs flex items-start space-x-2.5 shadow-inner">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed font-medium">
                {errorMessage}
              </div>
            </div>
          )}

          {/* Google Authentication Actions */}
          <div className="my-6 space-y-3">
            {isBlockedBrowser ? (
              <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs text-center font-bold leading-relaxed">
                <AlertCircle className="w-7 h-7 text-red-400 mx-auto mb-2" />
                Trình duyệt in-app Messenger/Zalo KHÔNG HỖ TRỢ Đăng nhập Google! <br /><br />
                Vui lòng bấm vào dấu <strong className="text-white">3 chấm (•••)</strong> ở góc trên bên phải màn hình ➔ chọn <strong className="text-white">"Mở bằng trình duyệt" (Open in Chrome/Safari)</strong> để Đăng nhập nhé!
              </div>
            ) : (
              <>
                {/* Method 1: Quick Popup Login */}
                <button
                  onClick={handleQuickPopupLogin}
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white text-gray-950 font-sans-clean font-extrabold text-sm sm:text-base flex items-center justify-center space-x-3 transition-all cursor-pointer hover:bg-amber-100 hover:scale-[1.02] active:scale-98 shadow-[0_0_20px_rgba(255,255,255,0.25)] disabled:opacity-50 border-2 border-white"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-gray-900" />
                      <span>Đang kết nối Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                        />
                      </svg>
                      <span>Đăng nhập bằng Google</span>
                    </>
                  )}
                </button>

                {/* Method 2: Redirect Login */}
                <button
                  onClick={handleRedirectLogin}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 font-sans-clean text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Đăng nhập bằng trang mới</span>
                </button>
              </>
            )}

            {(!isFirebaseConfigured || errorMessage) && (
              <button
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 border border-white/20 font-sans-clean text-xs flex items-center justify-center transition-all cursor-pointer mt-2"
              >
                <span>Tiếp tục bằng tài khoản Demo / Khách</span>
              </button>
            )}

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="w-full py-2 px-4 rounded-xl bg-transparent hover:bg-white/5 text-gray-400 hover:text-white font-sans-clean text-xs flex items-center justify-center transition-colors cursor-pointer"
            >
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
