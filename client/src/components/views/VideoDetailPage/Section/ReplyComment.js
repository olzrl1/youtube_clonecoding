import React, { useState, useEffect } from 'react'
import SingleComment from './SingleComment'
function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)

    useEffect(() => {
      let commentNumber = 0;
      props.CommentLists.map((comment) => {
        if(comment.responseTo === props.parentCommentId){
            commentNumber ++
        }
      });
      setChildCommentNumber(commentNumber);
    }, [props.CommentLists])
    

    let renderReplyComment = (parentCommentId) =>
            props.CommentLists.map((comment, index) => (
                <React.Fragment>
                    {
                        comment.responseTo === parentCommentId && (
                        <div style={{ width: '80%', marginLeft: '40px'}}>
                            <SingleComment 
                                key={index}
                                comment={comment} 
                                postId={props.videoId} 
                                refreshFunction={props.refreshFunction}/>
                            <ReplyComment 
                                CommentLists={props.CommentLists} 
                                postId={props.videoId} 
                                parentCommentId={comment._id} 
                                refreshFunction={props.refreshFunction}/>
                        </div>
                    )}
                </React.Fragment>
            ));
        
        
    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    };
    

    return (
        <div>

            {
                ChildCommentNumber > 0 &&
                    <p style={{ fontSize: '14px', marginTop : 0, color: 'gray'}} 
                    onClick={onHandleChange}>
                        {/* {ChildCommentNumber}  */}
                        답글 보기
                    </p>
            }

            {
            OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
            }
            
        </div>
    )
}

export default ReplyComment