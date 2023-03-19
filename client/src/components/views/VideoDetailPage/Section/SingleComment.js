import React, { useState } from 'react'
import {
  Comment,
  Avatar,
  Button,
  Input
} from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux'
import LikeDislikes from './LikeDislikes'
const { TextArea } = Input; 


function SingleCommet(props) {
    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")
    const user = useSelector(state => state.user);
    
    const onClickReplyOpen = () => {
      setOpenReply(!OpenReply);
    }

    const onHandleChange = (e) => {
      setCommentValue(e.currentTarget.value)
    }

    const onSubmit = (e) => {
      
      const variables = {
        writer: user.userData._id,
        postId: props.postId,
        responseTo: props.comment._id,
        content: CommentValue
      };
      e.preventDefault();
      
      Axios.post('/api/comment/saveComment', variables)
      .then(response => {
          if(response.data.success){
              setCommentValue("")
              setOpenReply(!OpenReply)
              props.refreshFunction(response.data.result);
          }
          else{
              alert('댓글 작성을 실패했습니다.')
          }
      })

    }

    const actions = [
      < LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id} />
      ,<sapn onClick={onClickReplyOpen} key="comment-basic-reply-to"> 답글 </sapn>
    ];

    return (
      <div>
        <Comment
            actions={actions}
            author={props.comment.writer.name}
            avatar = { < Avatar src={props.comment.writer.image} alt />}
            content= {<p> {props.comment.content} </p>}
        />
        {OpenReply && 
        <form style= {{ display : 'flex' }} onSubmit={onSubmit}>
          <textarea
              style={{ width: '100%' , borderRadius: '5px'}}
              onChange={onHandleChange}
              value={CommentValue}
              placeholder='답글을 작성해주세요.'
          />
          <br/>
          <button style={{ width: '20%', height: '52px'}} onClick={onSubmit}> 등록 </button>
        </form>
        }
        
      </div>
    )
}

export default SingleCommet