import mongoose, {Schema} from 'mongoose';

import moongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, // cloudinary url
            required: true
        },

        thumbnail: {
            type: String, // cloudinary url
            required: true
        },  

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        duration: {
            type: Number, // cloudinary url
            required: true
        },

        views: {
            type: Number,
            default: 0
        },

        isPublished: {
            type: Boolean,
            default: false
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },

    {
        timestamps: true
    }
)

// to understand this go to moongoose 
// What is mongoose-aggregate-paginate-v2?
// This is a Mongoose plugin that adds pagination support for aggregation queries.

// Imagine your video platform has 10,000 videos. Returning all 10,000 videos in 
// one response would be inefficient. Instead, you can return 10 videos per page.

videoSchema.plugin(moongooseAggregatePaginate) 
export const Video = mongoose.model("Video", videoSchema)