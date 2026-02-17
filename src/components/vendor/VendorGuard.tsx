import { Navigate } from "react-router-dom";
import { isVendorLoggedIn } from "@/lib/store";

const VendorGuard = ({ children }: { children: React.ReactNode }) => {
    if (!isVendorLoggedIn()) {
        return <Navigate to="/vendor/login" replace />;
    }
    return <>{children}</>;
};

export default VendorGuard;
