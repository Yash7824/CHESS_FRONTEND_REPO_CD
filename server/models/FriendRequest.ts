import mongoose from 'mongoose';
const { Schema } = mongoose;

const FriendRequestSchema = new Schema({
    currentUserId: {
        type: String,
        required: true
    },
    friendId: {
        type: String,
        required: true
    },
    user: {
        type: String
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