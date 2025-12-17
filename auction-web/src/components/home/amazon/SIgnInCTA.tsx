import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  isLoggedIn: boolean;
}

const SignInCTA: React.FC<Props> = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  if (isLoggedIn) return null;

  return (
    <>
      {/* Sign-in recommendation */}
      <section className="bg-white border-t border-b border-gray-300 mt-12">
        <div className="max-w-[1500px] mx-auto px-4 py-8 text-center">
          <h2 className="text-lg font-semibold mb-4">
            See personalized recommendations
          </h2>

          <button
            onClick={() => navigate("/login")}
            className="
              bg-[#FFD814]
              hover:bg-[#F7CA00]
              text-black
              font-semibold
              px-8
              py-2
              rounded-full
              text-sm
            "
          >
            Sign in
          </button>

          <div className="text-xs mt-2">
            New customer?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 hover:underline"
            >
              Start here.
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignInCTA;
