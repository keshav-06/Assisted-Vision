import "./Board.scss";
import { useSpeechSynthesis, useSpeechRecognition } from "react-speech-kit";
import { useState, useEffect, useRef } from "react";

const Board = () => {
    const { speak, speaking, cancel } = useSpeechSynthesis();

    const [value, setValue] = useState("");

    const [reset, setReset] = useState(false);

    const [winner, setWinner] = useState('');

    const { listen, stop } = useSpeechRecognition({
        onResult: (result) => {
            console.log(result)
            setValue(result);
        },
    });

    useEffect(() => {
        switch (value) {
            case "1":
            case "top left":
                draw(1);
                break;
            case "2":
            case "top":
                draw(2);
                break;
            case "3":
            case "top right":
                draw(3)
                break;
            case "4":
            case "left":
                draw(4)
                break;
            case "5":
            case "centre":
                draw(5)
                break;
            case "6":
            case "right":
                draw(6)
                break;
            case "7":
            case "bottom left":
                draw(7)
                break;
            case "8":
            case "bottom":
                draw(8)
                break;
            case "9":
            case "bottom right":
                draw(9)
                break;
            case "stop":
                stop();
                speak({ text: "Stopping" });
                break;
            case "reset":
                setReset(true);
                break;
            default:
                break;
        }
    }, [value])

    // Creating a turn state, which indicates the current turn
    const [turn, setTurn] = useState(0);

    // Creating a data state, which contains the
    // current picture of the board
    const [data, setData] = useState(["", "", "", "", "", "", "", "", ""]);

    // Creating a reference for the board
    const boardRef = useRef(null);

    useEffect(async() => {
        if (winner === "") {
            await speak({ text: "Player " + (turn + 1) + "'s Turn" });
        } else {
            await speak({ text: winner });
        }
    }, [turn, winner, setWinner]);

    // Function to draw on the board
    const draw = (index) => {
        if (speaking) {
            cancel();
        }
        // Draws only if the position is not taken
        // and winner is not decided yet
        if (data[index - 1] === "" && winner === "") {
            // Draws X if it's player 1's turn else draws O
            const current = turn === 0 ? "X" : "O";

            // Updating the data state
            data[index - 1] = current;

            //Drawing on the board
            boardRef.current.querySelectorAll(".input")[index - 1].innerText = current;

            // Setting the winner in case of a win
            if (checkWin()) {
                setWinner(turn === 0 ? "Player 1 Wins!" : "Player 2 Wins!");
            } else if (checkTie()) {
                // Setting the winner to tie in case of a tie
                setWinner("It's a Tie!");
            } else {
                // Switching the turn
                setTurn(turn == 0 ? 1 : 0);
            }
        } else {
            let player = data[index - 1] === "X" ? "Player 1" : "Player 2";
            speak({ text: "Invalid Move, box occupied by " + player });
        }
    };

    // Checks for the win condition in rows
    const checkRow = () => {
        let ans = false;
        for (let i = 0; i < 9; i += 3) {
            ans |=
                data[i] === data[i + 1] && data[i] === data[i + 2] && data[i] !== "";
        }
        return ans;
    };

    // Checks for the win condition in cols
    const checkCol = () => {
        let ans = false;
        for (let i = 0; i < 3; i++) {
            ans |=
                data[i] === data[i + 3] && data[i] === data[i + 6] && data[i] !== "";
        }
        return ans;
    };

    // Checks for the win condition in diagonals
    const checkDiagonal = () => {
        return (
            (data[0] === data[4] && data[0] === data[8] && data[0] !== "") ||
            (data[2] === data[4] && data[2] === data[6] && data[2] !== "")
        );
    };

    // Checks if at all a win condition is present
    const checkWin = () => {
        return checkRow() || checkCol() || checkDiagonal();
    };

    // Checks for a tie
    const checkTie = () => {
        let count = 0;
        data.forEach((cell) => {
            if (cell !== "") {
                count++;
            }
        });
        return count === 9;
    };

    // UseEffect hook used to reset the board whenever
    // a winner is decided
    useEffect(async() => {
        // Clearing the data state
        setData(["", "", "", "", "", "", "", "", ""]);

        // Getting all the children(cells) of the board
        const cells = boardRef.current.children;

        // Clearing out the board
        for (let i = 0; i < 9; i++) {
            cells[i].innerText = "";
        }

        // Resetting the turn to player 0
        setTurn(0);

        // Resetting the winner
        setWinner("");
        setReset(false);
    }, [reset, setReset, setWinner]);

    const initGame = async() => {
        await speak({
            text: "Welcome to Tic Tac Toe, you can either click on the boxes or say the number of the box you want to click on. The boxes range from 1 to 9. Player 1 will go first",
        });
        await listen({ interimResults: true });
    };

    return ( <
        div className = "board-container" >
        <
        div className = { `winner ${winner !== '' ? '' : 'shrink'}` } > { /* Display the current winner */ } <
        div className = 'winner-text' > { winner } < /div> { /* Button used to reset the board */ } <
        button onClick = {
            () => setReset(true) } >
        Reset Board <
        /button> <
        /div> <
        div ref = { boardRef }
        className = "board" >
        <
        div className = "input input-1"
        onClick = {
            () => draw(1) } > < /div> <
        div className = "input input-2"
        onClick = {
            () => draw(2) } > < /div> <
        div className = "input input-3"
        onClick = {
            () => draw(3) } > < /div> <
        div className = "input input-4"
        onClick = {
            () => draw(4) } > < /div> <
        div className = "input input-5"
        onClick = {
            () => draw(5) } > < /div> <
        div className = "input input-6"
        onClick = {
            () => draw(6) } > < /div> <
        div className = "input input-7"
        onClick = {
            () => draw(7) } > < /div> <
        div className = "input input-8"
        onClick = {
            () => draw(8) } > < /div> <
        div className = "input input-9"
        onClick = {
            () => draw(9) } > < /div> <
        /div> <
        div className = "speech-button"
        onClick = {
            () => {
                initGame();
            }
        } >
        Start Game <
        /div> <
        /div>
    );
};

export default Board;