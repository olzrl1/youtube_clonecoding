import React, { useEffect, useState } from 'react';
import Axios from 'axios';
function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)
    
    useEffect(() => {

        let variable = { userTo: props.userTo}
        Axios.post('/api/subscribe/subscribeNumber', variable)
        .then(response => {
            if(response.data.success){
                setSubscribeNumber(response.data.subscribeNumber)
            }
            else{
                alert('구독자 수 로딩 오류');
            }
        })

        let subscribedVariable = {
            userTo: props.userTo,
            userFrom: localStorage.getItem('userId')
        }
        
        Axios.post('/api/subscribe/subscribed', subscribedVariable)
        .then(response => {
            if(response.data.success){
                setSubscribed(response.data.subscribed);
            }
            else{
                alert('정보를 받아오지 못 했습니다.')
            }
        })

    }, [])
    
    const onSubscribe = () =>{
        let subscribedVariable = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }
        // 이미 구독중
        if(Subscribed){
            Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
            .then(response => {
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber - 1)
                    setSubscribed(!Subscribed)
                }
                else{
                    alert('구독 취소 실패')
                }
            })
        }

        // 구독중 X
        else{
            Axios.post('/api/subscribe/subscribe', subscribedVariable)
            .then(response => {
                if(response.data.success){
                    setSubscribeNumber(SubscribeNumber + 1)
                    setSubscribed(!Subscribed)
                }
                else{
                    alert('구독 실패')
                }
            })
        }

    }

    return (
        <div>
            <button onClick={onSubscribe}
                style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,borderRadius: '4px', color: 'white',
                    padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                
            >
                {SubscribeNumber} {Subscribed ? '구독중' : '구독'}
            </button>
        </div>
    )
}

export default Subscribe