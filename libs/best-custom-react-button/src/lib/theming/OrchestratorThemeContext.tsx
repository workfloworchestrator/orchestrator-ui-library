import { createContext, FC, ReactNode } from 'react';
import { defaultTheme, MyTheme } from './OrchestratorTheme';

export const OrchestratorThemeContext = createContext(defaultTheme);

type OrchestratorThemeProviderProps = {
    children: ReactNode;
    theme: MyTheme;
};

const OrchestratorThemeProvider: FC<OrchestratorThemeProviderProps> = ({
    children,
    theme,
}) => {
    // Future: make it toggleable (dark / light)
    // const [currentTheme, setCurrentTheme] = useState(theme);

    return (
        <OrchestratorThemeContext.Provider value={theme}>
            {children}
        </OrchestratorThemeContext.Provider>
    );
};

export { OrchestratorThemeProvider };
