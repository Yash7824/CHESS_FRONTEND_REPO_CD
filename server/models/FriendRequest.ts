import mongoose from 'mongoose';
const { Schema } = mongoose;

const FriendRequestSchema = new Schema({
    userId: {
        type: String,
    },
    friendId: {
        type: String,
        required: true
    },
    friend: {
        type: String
    },
    status: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
      }
});

const FriendRequest = mongoose.model('FriendRequestSchema', FriendRequestSchema);
export default FriendRequest;