import { useEffect, useState } from 'react';
import { useSpeechSynthesis, useSpeechRecognition } from "react-speech-kit";
import questions from './questions.js';
import './Quiz.scss'

const Quiz = () =>{
    const [question, setQuestion] = useState(0);
    const [value, setValue] = useState("");
    const [selected, setSelected] = useState([]);

    const { speak, speaking, cancel } = useSpeechSynthesis();

    const { listen, stop } = useSpeechRecognition({
        onResult: (result) => {
            console.log(result)
            setValue(result);
        },
    });

    const selectAnswer = async (i) => {
        let arr = [...selected]
        let option = questions[question].options[i];
        arr[question] = option;
        await speak({text: "Selected " + option, queue: false});
        setSelected(arr);
    }

    const startListening = async () => {
        await speak({text: "We are listening to you", queue: false});
        await readQuestionAndOptions();
        await speak({text: "Please select an option", queue: false});
        listen();
    }

    const readQuestionAndOptions = async () => {
        await speak({text: "current question: ", queue: true});
        await speak({text: questions[question].question, queue: true});
        return;
    }

    useEffect(() => {
        let arr = []
        for(let i=0; i<questions.length; i++){
            arr.push("")
        }
        setSelected(arr)
    }, []);

    useEffect(()=>{
        switch (value) {
            case "read question":
                speak({text: questions[question].question, queue: false});
                break;

            case "read options":
                speak({text: questions[question].options, queue: false});
                break;

            case "next question":
                changeQuestion("next")
                break;
            
            case "previous question":
                changeQuestion("prev")
                break;

            case "read option 1":
                speak({text: questions[question].options[0], queue: false});
                break;
            
            case "read option 2":
                speak({text: questions[question].options[1], queue: false});
                break;

            case "read option 3":
                speak({text: questions[question].options[2], queue: false});
                break;

            case "read option 4":
                speak({text: questions[question].options[3], queue: false});
                break;

            case "select option 1":
                selectAnswer(0);
                break;

            case "select option 2":
                selectAnswer(1);
                break;

            case "select option 3":
                selectAnswer(2);
                break;

            case "select option 4":
                selectAnswer(3);
                break;

            case "read selected option":
                const option = selected[question]
                speak({text: option!="" ? option:"No option selected", queue: false});
                break;

            case "read all selected options":
                for(let i=0; i<selected.length; i++){
                    const option = selected[i]
                    speak({text: "Question: " + questions[i].question, queue: true});
                    speak({text: option!="" ? "Option selected: " + option:"No option selected", queue: true});
                }
                break;

            case "stop":
                stop();
                speak({text: "Stopped", queue: false});
                break;

            default:
                break;
        }
    },[value])

    useEffect(()=>{
        readQuestionAndOptions();
    },[question])

    const changeQuestion = (where) =>{
        if(where === 'next' && question < questions.length-1){
            setQuestion(question+1);
        }else if(where === 'prev' && question > 0){
            setQuestion(question-1);
        }
    }

    return(
        <div className="Quiz">
            <h1>Quiz</h1>
            <div className="question-section">
                <p className="question"> {questions[question].question}</p>
                <div className="options">
                    {questions[question].options.map((option, i)=>{
                        return(
                            <button className={`option ${selected[question] === option ? "selected" : ""}`} key={i} onClick={()=>{selectAnswer(i)}}>
                                {option}
                            </button>
                        )
                    })}
                </div>
            </div>
            <div className="bottom-buttons">
                <div onClick={()=>{changeQuestion("prev")}} className="bottom-button">Prev Q</div>
                <div onClick={()=>{startListening()}} className="bottom-button voice">Start Voice Recognition</div>
                <div onClick={()=>{changeQuestion("next")}} className="bottom-button">Next Q </div>
            </div>
        </div>
    )
}

export default Quiz;