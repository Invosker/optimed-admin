import { useEffect } from 'react';
import './CuboidGrid.css'; // Make sure to import the CSS file

const CuboidGrid = () => {
    useEffect(() => {
        // Any additional JavaScript setup if needed
    }, []);

    const cuboids = Array.from({ length: 16 }, (_, b) => (
        <div className="cuboid" key={b}>
            {Array.from({ length: 6 }, (_, s) => (
                <div className="side" key={s}></div>
            ))}
        </div>
    ));

    return <div className="content">{cuboids}</div>;
};

export default CuboidGrid;
