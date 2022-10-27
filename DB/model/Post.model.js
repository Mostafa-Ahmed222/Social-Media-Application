import {Schema, model, Types} from 'mongoose'

const postSchema = new Schema({
    postBody : {
        type : String,
        required : true
    },
    createdBy : {
        type : Types.ObjectId,
        ref : 'User',
        required : true,
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    likes : [{type: Types.ObjectId, ref : 'User'}],
    unlikes : [{type: Types.ObjectId, ref : 'User'}],
    postPicture : String,
    commentId : [{type : Types.ObjectId, ref : 'Comment'}]
}, {
    timestamps : true
})
const postModel = model('Post', postSchema)
export default postModel