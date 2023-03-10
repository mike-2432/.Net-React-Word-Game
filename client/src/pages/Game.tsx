import React, {useEffect, useState, useRef} from 'react';
import Countdown from '../components/Countdown';
import { useGlobalContext } from '../Context';
import URL from '../URL';

// GAME //
const Game = () => {
    const { classicHS, setClassicHS } = useGlobalContext();

    const TIME = 1000;
    const tileRef = useRef<HTMLDivElement>(null!);

    interface gameStatusProps {
        play:boolean;
        msg:string
    }
    const [game, setGame] = useState<gameStatusProps>( {play:false, msg:""} );
    const [word, setWord] = useState<Array<Array<string>>>([[]]);
    const [usedWords, setUsedWords] = useState<Array<string>>([]);
    const [options, setOptions] = useState<Array<string>>([]);
    const [guess, setGuess] = useState<Array<string>>([]);
    const [score, setScore] = useState<number>(0);
    const [tempScore, setTempScore] = useState<number>(0);
    const [winAnimation, setWinAnimation] = useState<boolean>(false);
    const [counter, setCounter] = useState<number>(0); 

    // FETCH WORD //
    const getWord = async() => {
        try {
            const wordLength = Math.min(Math.floor(3+(score/5)), 6);
            const response = await fetch(URL+"/api/Word/GetWord/"+wordLength.toString());
            const jsonResponse = await response.json();
            const wordList = jsonResponse.data;
            
            if(usedWords.includes(wordList)) {
                getWord();
                return
            } else {
                setUsedWords([...usedWords, wordList])
            }
            const newWordList:Array<Array<string>> = [];
            wordList.split(', ').map((word:string) => newWordList.push(word.toUpperCase().split('')));
            setWord(newWordList);
            setCounter(103);
            return
        } catch(err) {
            setGame({...game, play:false, msg:"Could not make a connection to the server..."});
        }        
    };

    // CHECK RESULT //
    const checkResult = () => {
        for(let option of word) {
            if(JSON.stringify(option) === JSON.stringify(guess)) {
                setWinAnimation(true);
                setScore(tempScore+1);
                return;
            }
        }
        tileRef.current.classList.add('shake');
        setGuess([]);  
    }

    // HANDLE LOSS //
    const timeUp = () => {
        setUsedWords([]);
        setGame({...game, play:false, msg:"Times Up..."});
    }

    // HANDLE START //
    const startGame = () => {
        setScore(0);
        setTempScore(0);
        setCounter(500);
        // Remove counter here and move after word is loaded
        setGame({...game, play:true, msg:""});
    }
    
    // RESET WORD IF SUCCESS AFTER CERTAIN TIME //
    useEffect(() => {
        if(score === 0) {
            getWord();
            return
        }

        setCounter(115);
        const timer = setTimeout(() => {
            setGuess([]);
            getWord();
            setTempScore(score);
            if(score > parseInt(classicHS)) setClassicHS(String(score));
        }, TIME);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [score, game]);

    // GENERATE THE OPTIONS //
    useEffect(() => {
        const generateOptions = () => {
            if(word[0].length === 0) return;
            setOptions([]);
            let newOptionsArr:Array<string> = [];
            let originalWord:Array<string> = [...word[0]];

            while(originalWord.length > 0) {
                const random = Math.floor(Math.random()*originalWord.length);
                newOptionsArr.push(originalWord[random]);
                originalWord.splice(random, 1);
            }

            // Re-generate when word and option are identical
            while(checkIdentical(newOptionsArr)) {
                newOptionsArr = [];
                originalWord = [...word[0]];
                while(originalWord.length > 0) {
                    const random = Math.floor(Math.random()*originalWord.length);
                    newOptionsArr.push(originalWord[random]);
                    originalWord.splice(random, 1);
                }
            }
            setOptions([...newOptionsArr]);   
        }

        const checkIdentical = (newArr:Array<String>) => {
            for(let possibility of word) {
                if(JSON.stringify(newArr) === JSON.stringify(possibility)) return true;
            }
            return false;
        }
        generateOptions();
    }, [word]);

    // HANDLE INPUT //
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('animationend', shake);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('animationend', shake);
        }
    });
    const handleKeyPress = (e: KeyboardEvent) => {
        if(options.includes(e.key.toUpperCase()) && guess.length < word[0].length) {
            setGuess([...guess, e.key.toUpperCase()])
        } 
        if(e.key === 'Backspace') {
            setGuess(guess.slice(0, -1));
        }
        if(e.key === 'Enter' && guess.length !== word[0].length) {
            tileRef.current.classList.add('shake')
        }
        if(e.key === 'Enter' && guess.length === word[0].length) {
            checkResult();
        }
    }
    const shake = () => {
        tileRef.current.classList.remove('shake');
    }

    // ALERT //
    useEffect(() => {
        const timer = setTimeout(() => {
            setWinAnimation(false);
        }, TIME);
        return () => clearTimeout(timer);
    }, [winAnimation]);
       
    // RETURN //
    return (
        <>
            <div className="page-container">                

                {/* The Score */}
                <div className="score-board">
                    <div className="score">Score {score}</div>
                    <div className="high-score">{classicHS[0] ? classicHS : classicHS[0]} High Score</div>
                </div>

                {/* The Game */}
                {game.play && <>                
                    <div ref={tileRef} className="letter-boxes">
                        {options.map((letter:String, i:number) => {
                            return <div key={i} style={{animationDelay:"calc("+i+"*50ms"}} className={`tile `+ (winAnimation===true ? `success` : ``)}>
                                    {guess[i]}
                                </div>
                        })}
                    </div>                
                    <div className="letter-boxes">
                        {options.map((letter:String, i:number) => {
                            return <div key={i} className={`tile`}>{options[i]}</div>
                        })}
                    </div>                
                    <Countdown counter={counter} setCounter={setCounter} timeUp={timeUp}/>
                </>}    

                {/* The Menu */}
                {game.play || <>
                    <div className="play-btn-container">
                        <p>{game.msg}</p>
                        <button className="play-btn" onClick={startGame}>Play</button>                        
                    </div>
                </>}
            </div>
        </>
    )
}

export default Game