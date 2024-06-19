import React, { useRef, useState } from 'react';
import iconLove from '../../assets/icons/iconLove-outlined.png';
import iconLoveFilled from '../../assets/icons/iconLove-filled.png';
import iconComment from '../../assets/icons/messages.png';
import { IoIosSend } from 'react-icons/io';
import PropTypes from 'prop-types';
import 'animate.css';
import { formattedDate, formattedTime } from '../../utils';
import placeholderPhotoProfile from '../../assets/images/placeholderPhotoProfile.png';
import { useDispatch } from 'react-redux';
import { createCommentAsync } from '../../states/comments/commentsThunk';
import { getDetailPostAsync } from '../../states/posts/postThunk';

export default function PostDetail({
  id,
  image,
  content,
  user,
  created_at,
  updated_at,
  comments,
  post_up_votes,
  myProfile
}) {
  const [comment, setComment] = useState('');
  const commentInputRef = useRef(null);
  const desc = { __html: content };
  const dispatch = useDispatch();

  const onCommentChangeHandler = (e) => {
    setComment(e.target.innerText);
  };

  const onFocusCommentInput = () => {
    commentInputRef.current.focus();
  };

  const onClickCommentHandler = () => {
    dispatch(createCommentAsync({ content: comment, post_id: id }));
    dispatch(getDetailPostAsync({ id }));
  };

  return (
    <section
      className={`container flex h-[40rem] ${comments > 0 ? 'h-[40rem]' : 'h-fit'} w-96  ${image ? 'sm:w-[70rem]' : ''} rounded-md text-textPrimary bg-eerieBlack`}
    >
      <div className="flex min-w-full">
        <div className={`items-baseline hidden w-full h-full  ${image ? 'md:flex' : 'hidden'}`}>
          <img src={image} alt="post" className="object-contain w-full h-full " />
        </div>
        <div className="relative flex flex-col w-full md:max-w-[25rem]">
          <div className="absolute left-0 z-20 flex items-center w-full gap-3 px-4 py-2">
            <img
              src={user?.photo_profile?.photo_profile || placeholderPhotoProfile}
              alt="img post"
              className="object-cover w-8 h-8 rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-sm font-medium text-textPrimary">{user?.name}</p>
              <p className="text-[10px] font-medium text-textSecondary">{user?.biodata?.role}</p>
            </div>
          </div>
          <div className="px-4 py-2 overflow-auto border-y border-[#262626] h-[25rem] mt-12">
            <div dangerouslySetInnerHTML={desc} className="text-[15px] text-textPrimary" />
            <div className="flex gap-2 mt-2 text-[10px] font-medium">
              <p className="text-[#A9A9A9]">{formattedDate(created_at)}</p>
              <p className="text-[#7A7A7A]">•</p>
              <p className="text-[#A9A9A9]">{formattedTime(updated_at)}</p>
            </div>
            <p className="mt-5 text-xs font-medium text-textSecondary">
              {comments?.length} comments
            </p>
            <div className="h-[2px] mt-3 mb-5 bg-[#262626]" />
            <div className="flex flex-col gap-5">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-1">
                    <img
                      src={comment?.user?.photo_profile?.photo_profile || placeholderPhotoProfile}
                      alt="img post"
                      className="object-cover w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="w-full px-3 py-2 rounded-md bg-searchInput">
                        <div className="flex flex-col mb-2">
                          <div className="flex items-baseline gap-2">
                            <p className="text-sm font-medium text-textPrimary">
                              {comment.user.name}
                            </p>
                            <p className="text-xs text-[#7A7A7A]">•</p>
                            <p className="text-[10px] text-[#A9A9A9]">
                              {formattedTime(comment.updated_at)}
                            </p>
                          </div>
                          <p className="text-[9px] font-medium text-textSecondary">
                            {comment.user.biodata?.role}
                          </p>
                        </div>
                        <p className="text-xs">{comment.content}</p>
                      </div>
                      <div className="flex gap-1 my-2 text-xs text-textPrimary">
                        <button>Like</button>
                        <p className="text-xs text-[#7A7A7A]">•</p>
                        <p>{comment.comments_up_votes.length}</p>
                        <p className="text-xs mx-2 text-[#eaeaea]">|</p>
                        <button>Reply</button>
                        <p className="text-xs text-[#7A7A7A]">•</p>
                        <p>{comment.reply_comments.length}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-textSecondary">There are no comments on this post.</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1 px-4 pb-2 text-xs">
            <div className="flex gap-5 my-3 sm:px-0 text-textPrimary">
              <div className="flex items-center gap-1">
                <button
                  className={
                    post_up_votes.find((vote) => myProfile && vote.user_id === myProfile.id)
                      ? 'hover:cursor-not-allowed'
                      : ''
                  }
                  disabled={
                    post_up_votes.find((vote) => myProfile && vote.user_id === myProfile.id)
                      ? true
                      : false
                  }
                >
                  <img
                    src={
                      post_up_votes.find((vote) => myProfile && vote.user_id === myProfile.id)
                        ? iconLoveFilled
                        : iconLove
                    }
                    alt=""
                    className="w-7"
                  />
                </button>
                <p>{post_up_votes.length} Likes</p>
              </div>
              <div className="flex items-center gap-2 ">
                <button onClick={onFocusCommentInput}>
                  <img src={iconComment} alt="" className="w-6" />
                </button>
                <p>{comments.length}</p>
              </div>
            </div>
            <div className="flex items-center w-full gap-2">
              <img
                src={
                  myProfile === null || myProfile.photo_profile === null
                    ? placeholderPhotoProfile
                    : myProfile.photo_profile.photo_profile
                }
                alt="img post"
                className="object-cover rounded-full w-7 h-7"
              />
              <div className="flex gap-2">
                <div
                  ref={commentInputRef}
                  className={`py-2 px-3 w-[17rem] ${image ? 'md:w-72' : 'md:w-64'} text-[10px] bg-searchInput border border-[#262626] rounded-md text-textPrimary overflow-auto h-10 cursor-text text-sm  placeholder:text-textPrimary focus:border-[#2d2d2d] focus:outline focus:ring-0`}
                  contentEditable
                  onInput={onCommentChangeHandler}
                  data-placeholder="Add a comment"
                />
                <button
                  type="submit"
                  onClick={() => onClickCommentHandler()}
                  className="bg-searchInput transition-all duration-300 hover:text-ufoGreen right-0 px-3 me-10 w-auto rounded-md py-2 h-10 text-lg font-medium hover:shadow text-[#A9A9A9] hover:bg-opacity-70"
                >
                  <IoIosSend title="Send" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

PostDetail.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  created_at: PropTypes.string.isRequired,
  updated_at: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  post_up_votes: PropTypes.arrayOf(PropTypes.object).isRequired,
  myProfile: PropTypes.instanceOf(Object).isRequired
};
