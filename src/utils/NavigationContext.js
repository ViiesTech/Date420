import React, { createContext, useContext, useRef } from 'react';

const NavigationContext = createContext();

export function NavigationProvider({ children }) {
    const navigationRef = useRef(null);
    
    const navigate = (name, params) => {
        if (navigationRef.current) {
            navigationRef.current.navigate(name, params);
        }
    };

    return (
        <NavigationContext.Provider value={{ navigate, navigationRef }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    return useContext(NavigationContext);
}
