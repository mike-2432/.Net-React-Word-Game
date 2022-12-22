import {useEffect} from 'react';

// COUNTDOWN COMPONENT //
const Countdown = ({counter, setCounter, timeUp}:any) => {
    
    useEffect(() => {
        const timer:any = counter > 0 && setInterval(() => setCounter(counter - 1), 200);
        if(counter === 0) timeUp();
        return () => clearInterval(timer);
    }, [counter, setCounter, timeUp])

    return (
        <div className="countdown">
            <div style={{width:counter+"%"}}></div>
        </div>
    )
}

export default Countdown