'use client';

interface AnonymousUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnonymousUserModal({ isOpen, onClose }: AnonymousUserModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className=" fixed inset-0 z-[1000] flex justify-end items-start"
      onClick={onClose}
    >
      <div
        className="bg-[#141519] mt-[60px] mr-[15px] w-[360px] py-4 top-15 left-0 h-screen z-[1100] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full">
          <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="mb-4 last:mb-0">
              <a
                href="/signup"
                className="block p-3 text-white no-underline transition-colors hover:bg-white/10"
                tabIndex={0}
              >
                <div className="flex flex-col gap-1">
                  <h5 className="text-base font-semibold m-0">Create Account</h5>
                  <div className="text-sm text-gray-400">
                    <p className="m-0">Sign up for free or become a Premium member.</p>
                  </div>
                </div>
              </a>

              <a
                href="/login"
                className="block p-3 text-white no-underline transition-colors hover:bg-white/10"
                tabIndex={0}
              >
                <div className="flex flex-col gap-1">
                  <h5 className="text-base font-semibold m-0">Login</h5>
                  <div className="text-sm text-gray-400">
                    <p className="m-0">Already a member? Welcome back.</p>
                  </div>
                </div>
              </a>

              <a
                href="/redeem"
                className="block p-3 text-white no-underline transition-colors hover:bg-white/10"
                tabIndex={0}
              >
                <div className="flex flex-col gap-1">
                  <h5 className="text-base font-semibold m-0">Gift Card</h5>
                  <div className="text-sm text-gray-400">
                    <p className="m-0">Have a gift card? Redeem it here.</p>
                  </div>
                </div>
              </a>
            </div>

            <div className="mb-0 px-3">
              <a
                href="/premium"
                className="block w-full bg-indigo-600 px-3 py-2 no-underline transition-opacity hover:opacity-90"
                tabIndex={0}
              >
                  <span className="flex text-white items-center justify-center gap-2 text-sm uppercase font-extrabold">
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.188 17l1.667-5.606-4.26 1.864L12 7.688l-3.596 5.57-4.259-1.864L5.812 17h12.376zm-14.08 1.285L1.614 9.9a1 1 0 0 1 1.36-1.2l4.673 2.045 3.512-5.442a1 1 0 0 1 1.68 0l3.514 5.442 4.674-2.046a1 1 0 0 1 1.36 1.201l-2.494 8.386a1 1 0 0 1-.959.715H5.067a1 1 0 0 1-.959-.715z" />
                  </svg>
                  7-Day Free Trial
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
