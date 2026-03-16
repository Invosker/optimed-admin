export const CombineContext = (...components) => {
    return components.reduce(
        (AccumulatedComponents, CurrentComponent) => {
            return ({ children })=> {
                return (
                    <AccumulatedComponents>
                        <CurrentComponent>{children}</CurrentComponent>
                    </AccumulatedComponents>
                );
            };
        },
        ({ children }) => <>{children}</>,
    );
};