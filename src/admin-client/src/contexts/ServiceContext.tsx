import React, {createContext, ReactNode, useContext} from "react";
import {IAuthService} from "../interfaces/IAuthService";


// The services injected into the application
export type ServiceContextType = {
    authService: IAuthService
}

// The properties for the ServiceProvider component
type ServiceProviderProps = {
    children: ReactNode
    services: ServiceContextType
}

// The context for the services
const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

// Hook to use the services from the context
export const useServices = (): ServiceContextType => {
    const context = useContext(ServiceContext)
    // This allows us to avoid having to check for undefined in every component that uses the hook
    if (context === undefined) {
        throw new Error('useServices must be used within a ServiceProvider')
    }
    return context
}

// The provider for the services
export const ServiceProvider: React.FC<ServiceProviderProps> = ({children, services}) => {
    return (
        <ServiceContext.Provider value={services}>
            {children}
        </ServiceContext.Provider>
    )
}
