import { useEffect, useState } from "react";
import ReviewPaymentModal from "../components/GlideModal/ReviewPaymentModal";
import logo from "../images/logo.png";
import paymentGatewayBg from "../images/login-background.jpg";
import { PaymentProvider } from "../contexts/PaymentContext";
import { useGlidePay } from '@paywithglide/glide-react';

function SpayGlidePGWidget() {
    const [pgModalOpen, setPGModalOpen] = useState(false);
    const [pgSessionId, setPGSessionId] = useState(null);
    const [decryptedSessionId, setDecryptedSessionId] = useState(null); // New state
    const glideAppId = import.meta.env.VITE_GLIDE_WIDGET_APP_ID;

    const handleDecryptedSession = (sessionId) => {
        console.log("Decrypted session ID:", sessionId);
        setDecryptedSessionId(sessionId);
    };

    // Hook must be called at top level
    const { openGlidePay } = useGlidePay({
         app: glideAppId,      // Replace with actual App ID
         sessionId: decryptedSessionId // Pass the state variable
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const session = params.get("session_id");
        
        if (session) {
            setPGSessionId(session);
            setPGModalOpen(true);
        }
    }, []);

    const handlePgConfirm = () => {
        //alert("Payment confirmed!");
        setPGModalOpen(false);
        // Open Glide Payment Gateway
        openGlidePay(); // Call the function returned by the hook
    };

    return (
        <section className="bg-gray-100 min-h-screen flex items-center justify-center px-6">
            <div
                className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-70" 
                style={{ backgroundImage: `url(${paymentGatewayBg})` }}
            ></div>
               
            {pgSessionId && (
                <PaymentProvider>
                    <ReviewPaymentModal
                        open={pgModalOpen}
                        pgSessionId={pgSessionId}
                        onConfirm={handlePgConfirm}
                        onClose={() => setPGModalOpen(false)}
                        onDecryptedSession={handleDecryptedSession}
                    />
                </PaymentProvider>
            )}
        </section>
    );
}

export default SpayGlidePGWidget;