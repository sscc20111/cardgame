import React, { useState, useEffect } from 'react';
import { Button, FloatingLabel, FormControl, Stack } from "react-bootstrap"

import 'bootstrap/dist/css/bootstrap.css';
import './style.css'
import cardimg from './img/cardBackground.png'


const Setting = ({Submit}) => {
    const [Total, setTotal] = useState('');

    const submit = (Total) => {
        Submit(Total)
        setTotal('')
    }

    return(<>
        <FloatingLabel className="levelInput mb-2" controlId="" label='카드 개수를 짝수로 입력하세요(최대:20)'>
            <FormControl type="number" placeholder="Game Level Choice" value={Total} onChange={(e) => setTotal(e.target.value)}></FormControl>
        </FloatingLabel>
        <Button className='' onClick={()=>submit(Total)}>시작!</Button>
    </>)
}

const Cards = ({ Total, Click, StartTime, Reset }) => {
    const Color = ["red", "orange", "yellow", "green", "blueviolet", "black", "cyan", "tomato", "pink", "blue"];
    const colorSlice = Color.slice(0, Total/2);
    const ArrayColor = colorSlice.concat(colorSlice)
    const [CardArray,setCardArray] = useState('')

    const gameStart = () => {//**게임 시작**
        const target = document.querySelectorAll('.Card');

        target.forEach((card,index)=>{//게임 시작 - 카드 보여주기 모션
            setTimeout(() => {
                card.classList.add('cardFlip');
            }, 500 + (40 * index));
        })

        setTimeout(() => {//게임 시작 - 카드 감추기
            target.forEach((card,index)=>{
                card.classList.remove('cardFlip');
            })
            StartTime(new Date());//게임 시작 - 타이머 시작
        }, 2000 + (target.length*100));
    }

    const shuffleArray = (array) => {//**카드 섞기**
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];// 배열의 요소를 서로 교환
        }
        setCardArray(ArrayColor)
        gameStart()
    }
    const reset = () => {//**재시작**
        const target = document.querySelectorAll('.Card.cardFlip');
        target.forEach((card)=>{//재시작 - 카드 감추기
            card.classList.remove('cardFlip')
        })
        setTimeout(() => {//재시작 - 카드 감춘후 셔플
            shuffleArray(ArrayColor)
        }, 600);
        Reset()
    }

    const CardClick = (e) => {
        const target = e.target;

        if(target.classList.contains('cardFlip') === false){//Flip 상태의 카드 선택 방지
            target.classList.add('cardFlip')
            Click(target)
        }
    }

    useEffect(()=> {
        shuffleArray(ArrayColor);
    },[])

    return (<>
        {Array.from({ length: Total }, (_, index) => (
            <div key={index + 1} data-key={index + 1} className='Card' onClick={(e)=>CardClick(e)}>
                <div className='cardInner'>
                    <div className='cardFront' style={{background:`${CardArray[index]}`}}></div>
                    <div className='cardBack' style={{backgroundImage: `url(${cardimg})`}}></div>
                </div>
            </div>
        ))}
        <button onClick={reset}>reset</button>
    </>)
};

const CardGame = () => {
    const [Total, setTotal] = useState('');
    const [inputVisible, setinputVisible] = useState(true)
    const [Selected,setSelected] = useState('');
    const [StartTime,setStartTime] = useState('')
    const [Completed,setCompleted] = useState([])

    const CardSetting = (total) => {
        setinputVisible(false);

        const totalOdd = (total % 2 !== 0) ? parseInt(total, 10)+1 : total; //홀수 제한
        const totalLimit = totalOdd > 20 ? 20 : totalOdd; //20개 초과 제한
        setTotal(totalLimit);
    }

    const Reset = () => {
        setStartTime('');//타이머 초기화
        setCompleted([]);//진행상황 초기화
    }

    const GameRule = (target) => {
        const targetkey = target.getAttribute('data-key');
        const targetColor = target.querySelector(".cardFront").style.background

        switch (true) {
            case Selected === '': //첫번째 카드 선택 판별
                setSelected(target); 
                break;
            case Selected.getAttribute('data-key') !== targetkey: //두번째 카드 선택 *동일 카드 선택 방지
                if (Selected.querySelector(".cardFront").style.background === targetColor) {//성공 여부 *동일 색 판별
                    setSelected('');//성공
                    setCompleted([...Completed,targetkey,Selected.getAttribute('data-key')])//진행상황에 push
                    if(Completed.length === Total-2){//모든 카드 성공
                        setTimeout(() => {
                            alert('축하합니다!' + ((new Date()-StartTime)/1000) + '초 걸렸습니다.');
                        }, 100);
                    }
                } else {
                    setSelected('');//실패
                    setTimeout(() => {
                        target.classList.remove('cardFlip')
                        Selected.classList.remove('cardFlip')
                    }, 600);
                }
                break;
            default:
                break;
        }
    }


    return(
        <div className="transitionBox">
            <div className="CardGame" style={{width:'100vw', height:'100vh'}}>
                {inputVisible ? (
                    <div className='inputBox position-absolute top-50 start-50 translate-middle'>
                        <Setting Submit={CardSetting}></Setting>
                    </div>
                ) : (
                    <Stack className='cardWrap position-absolute top-50 start-50 translate-middle' direction="horizontal" gap={3}>
                        <Cards Total={Total} Click={GameRule} StartTime={setStartTime} Reset={Reset}></Cards>
                    </Stack>
                )}
            </div>
        </div>
    )
}

export default CardGame