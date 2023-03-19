import Axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
import { Button, Input } from 'antd';
const { TextArea } = Input;

function Comment(props) {
    const user = useSelector(state => state.user)
    const videoId = props.postId
    const [commentValue, setcommentValue] = useState("")

    const handleClick = (e) => {
        setcommentValue(e.currentTarget.value)
    }
    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: videoId
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response => {
            if(response.data.success){
                console.log(response.data.result)
                setcommentValue("")
                props.refreshFunction(response.data.result);
            }
            else{
                alert('댓글 작성을 실패했습니다.')
            }
        })
    }

    return (
        <div>
            <br/>
            <p> 댓글 </p>
            <hr/>

            {/* Comment List */}
            {props.commentLists && props.commentLists.map((comment, index)=> (
                (!comment.responseTo && 
                    <React.Fragment>
                        <SingleComment
                        key={index} 
                        comment={comment} 
                        postId={videoId} 
                        refreshFunction={props.refreshFunction}/>
                        <ReplyComment 
                        CommentLists={props.commentLists} 
                        postId={videoId} 
                        parentCommentId={comment._id} 
                        refreshFunction={props.refreshFunction}/>
                    </React.Fragment>
                )
                
            ))}

            {/* Root Comment Form */}

            <form style= {{ display : 'flex' }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: '100%', borderRadius: '5px'}}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder='댓글을 작성해주세요.'
                />
                <br/>
                <button style={{ width: '20%', height: '52px'}} onClick={onSubmit} > 등록 </button>
            </form>

        </div>
    )
}

export default Comment